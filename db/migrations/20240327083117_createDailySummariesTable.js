/* eslint-disable func-names */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('dailyAnalytics', (table) => {
    table.increments('id').primary();
    table.date('date').notNullable();
    table.integer('companyid').unsigned().notNullable();
    table.integer('branchid').unsigned().notNullable();
    table.integer('totalsales').notNullable().defaultTo(0);
    table.integer('numberoftransactions').notNullable().defaultTo(0);
    table.integer('numberofitemssold').notNullable().defaultTo(0);
    // Optionally, add indexes for faster querying on these columns
    table.index(['date', 'company_id', 'branch_id'], 'idx_daily_analytics_on_date_company_branch');

    // Set up foreign key constraints
    table.foreign('company_id').references('id').inTable('companies')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.foreign('branch_id').references('id').inTable('branches')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    // Ensure unique entries for each company-branch-date combination
    table.unique(['date', 'company_id', 'branch_id'], 'unique_daily_analytics');
  })
    .then(() => knex.raw(`
    CREATE OR REPLACE FUNCTION update_daily_analytics()
    RETURNS TRIGGER AS $$
    DECLARE
        v_transaction_date DATE;
        v_company_id INTEGER;
        v_items_sold INTEGER;
    BEGIN
        -- Fetch the transaction date and company ID from the transactions table
        SELECT transactiondate, companyid INTO v_transaction_date, v_company_id
        FROM transactions WHERE id = NEW.transactionid;
    
        -- Calculate the total number of items sold for the transaction
        SELECT SUM(count) INTO v_items_sold FROM items WHERE transactionid = NEW.transactionid;
    
        -- Check if an entry exists for the company on the transaction date in dailyanalytics
        IF EXISTS (SELECT 1 FROM dailyanalytics WHERE date = v_transaction_date AND companyid = v_company_id) THEN
            -- Update the existing record
            UPDATE dailyanalytics
            SET numberoftransactions = numberoftransactions + 1,
                numberofitemssold = numberofitemssold + v_items_sold
            WHERE date = v_transaction_date AND companyid = v_company_id;
        ELSE
            -- Insert a new record if it does not exist
            INSERT INTO dailyanalytics(date, companyid, numberoftransactions, numberofitemssold)
            VALUES (v_transaction_date, v_company_id, 1, v_items_sold);
        END IF;
    
        RETURN NEW;
    END;
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
  return knex.schema.dropTableIfExists('daily_analytics');
};
