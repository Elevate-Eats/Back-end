/* eslint-disable func-names */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('dailyanalytics', (table) => {
    table.increments('id').primary();
    table.date('date').notNullable();
    table.integer('companyid').unsigned().notNullable();
    table.integer('branchid').unsigned().notNullable();
    table.integer('totalsales').notNullable().defaultTo(0);
    table.integer('numberoftransactions').notNullable().defaultTo(0);
    table.integer('numberofitemssold').notNullable().defaultTo(0);
    // Optionally, add indexes for faster querying on these columns
    table.index(['date', 'branchid'], 'idx_daily_analytics_on_date_branch');
    table.index(['date', 'companyid'], 'idx_daily_analytics_on_date_company');
    // Set up foreign key constraints
    table.foreign('companyid').references('id').inTable('companies')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.foreign('branchid').references('id').inTable('branches')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    // Ensure unique entries for each company-branch-date combination
    table.unique(['date', 'companyid', 'branchid'], 'unique_daily_analytics');
  })
    .then(() => knex.raw(`
    CREATE OR REPLACE FUNCTION update_daily_analytics()
    RETURNS TRIGGER AS $$
    DECLARE
        v_transaction_date DATE;
        v_company_id INTEGER;
        v_branch_id INTEGER;
        v_items_sold INTEGER;
        v_total_sales NUMERIC; -- Declare variable for total sales
    BEGIN
        -- Fetch the transaction date, company ID, and branch ID from the transactions table
        -- Adjust the transaction date by truncating it to the start of the day (midnight) in the Jakarta timezone
        SELECT DATE_TRUNC('day', transactiondate AT TIME ZONE 'Asia/Jakarta') AT TIME ZONE 'UTC', companyid, branchid 
        INTO v_transaction_date, v_company_id, v_branch_id
        FROM transactions WHERE id = NEW.transactionid;

        -- Convert truncated timestamp back to date
        v_transaction_date := v_transaction_date::date;
        -- Calculate the total number of items sold for the transaction
        SELECT SUM(count) INTO v_items_sold FROM items WHERE transactionid = NEW.transactionid;
        
        -- Calculate the total sales (sum of totalprice) for the transaction
        SELECT SUM(totalprice) INTO v_total_sales FROM items WHERE transactionid = NEW.transactionid; -- Calculate total sales

        -- Check if an entry exists for the company and branch on the transaction date in dailyanalytics
        IF EXISTS (SELECT 1 FROM dailyanalytics WHERE date = v_transaction_date AND companyid = v_company_id AND branchid = v_branch_id) THEN
            -- Update the existing record
            UPDATE dailyanalytics
            SET numberoftransactions = numberoftransactions + 1,
                numberofitemssold = numberofitemssold + v_items_sold,
                totalsales = totalsales + v_total_sales -- Update totalsales
            WHERE date = v_transaction_date AND companyid = v_company_id AND branchid = v_branch_id;
        ELSE
            -- Insert a new record if it does not exist
            INSERT INTO dailyanalytics(date, companyid, branchid, numberoftransactions, numberofitemssold, totalsales)
            VALUES (v_transaction_date, v_company_id, v_branch_id, 1, v_items_sold, v_total_sales); -- Include totalsales in insert
        END IF;
    
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
`))
    .then(() => knex.raw(`
    CREATE TRIGGER trigger_update_daily_analytics
    AFTER INSERT ON completetransactions
    FOR EACH ROW
    EXECUTE FUNCTION update_daily_analytics();
`));
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('dailyanalytics')
    .then(() => knex.raw('DROP TRIGGER IF EXISTS trigger_update_daily_analytics ON items;'))
    .then(() => knex.raw('DROP FUNCTION IF EXISTS update_daily_analytics();'));
};
