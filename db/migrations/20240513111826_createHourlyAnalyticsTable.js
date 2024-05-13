/* eslint-disable func-names */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('hourlyanalytics', (table) => {
    table.increments('id').primary();
    table.timestamp('datetime').notNullable(); // Store date and the beginning of the hour
    table.integer('companyid').unsigned().notNullable();
    table.integer('branchid').unsigned().notNullable();
    table.integer('totalsales').notNullable().defaultTo(0);
    table.integer('numberoftransactions').notNullable().defaultTo(0);
    table.integer('numberofitemssold').notNullable().defaultTo(0);

    table.index(['datetime', 'branchid'], 'idx_hourly_analytics_on_datetime_branch');
    table.index(['datetime', 'companyid'], 'idx_hourly_analytics_on_datetime_company');

    table.foreign('companyid').references('id').inTable('companies').onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.foreign('branchid').references('id').inTable('branches').onDelete('CASCADE')
      .onUpdate('CASCADE');

    table.unique(['datetime', 'companyid', 'branchid'], 'unique_hourly_analytics');
  })
    .then(() => knex.raw(`
    CREATE OR REPLACE FUNCTION update_hourly_analytics()
    RETURNS TRIGGER AS $$
    DECLARE
        v_transaction_datetime TIMESTAMP;
        v_company_id INTEGER;
        v_branch_id INTEGER;
        v_items_sold INTEGER;
        v_total_sales NUMERIC;
    BEGIN
        SELECT transactiondate, companyid, branchid INTO v_transaction_datetime, v_company_id, v_branch_id
        FROM transactions WHERE id = NEW.transactionid;

        -- Truncate to the nearest hour
        v_transaction_datetime := DATE_TRUNC('hour', v_transaction_datetime);

        SELECT SUM(count) INTO v_items_sold FROM items WHERE transactionid = NEW.transactionid;
        SELECT SUM(totalprice) INTO v_total_sales FROM items WHERE transactionid = NEW.transactionid;

        IF EXISTS (SELECT 1 FROM hourlyanalytics WHERE datetime = v_transaction_datetime AND companyid = v_company_id AND branchid = v_branch_id) THEN
            UPDATE hourlyanalytics
            SET numberoftransactions = numberoftransactions + 1,
                numberofitemssold = numberofitemssold + v_items_sold,
                totalsales = totalsales + v_total_sales
            WHERE datetime = v_transaction_datetime AND companyid = v_company_id AND branchid = v_branch_id;
        ELSE
            INSERT INTO hourlyanalytics(datetime, companyid, branchid, numberoftransactions, numberofitemssold, totalsales)
            VALUES (v_transaction_datetime, v_company_id, v_branch_id, 1, v_items_sold, v_total_sales);
        END IF;
    
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
`))
    .then(() => knex.raw(`
    CREATE TRIGGER trigger_update_hourly_analytics
    AFTER INSERT ON completetransactions
    FOR EACH ROW
    EXECUTE FUNCTION update_hourly_analytics();
`));
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('hourlyanalytics')
    .then(() => knex.raw('DROP TRIGGER IF EXISTS trigger_update_hourly_analytics ON completetransactions;'))
    .then(() => knex.raw('DROP FUNCTION IF EXISTS update_hourly_analytics();'));
};
