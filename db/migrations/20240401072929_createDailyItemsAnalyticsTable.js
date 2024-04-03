/* eslint-disable func-names */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('dailyitemanalytics', (table) => {
    table.increments(); // Creates an 'id' column as primary key with autoincrement
    table.date('date').notNullable();
    table.integer('companyid').unsigned().notNullable();
    table.integer('branchid').unsigned().notNullable();
    table.integer('menuid').unsigned().notNullable();
    table.integer('numberofitemssold').unsigned().notNullable();
    table.decimal('totalsales', 14, 2).notNullable();
    table.foreign('branchid').references('id').inTable('branches')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.foreign('menuid').references('id').inTable('menus')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.foreign('companyid').references('id').inTable('companies')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    // Additional indexes
    table.index('date');
    table.index(['branchid', 'date'], 'idx_dailyitemanalytics_on_branch_date');
    table.index(['branchid', 'menuid', 'date'], 'idx_dailyitemanalytics_composite', 'btree'); // Composite index for improved query performance
  })
    .then(() => knex.raw(`
      CREATE OR REPLACE FUNCTION update_daily_item_analytics() RETURNS TRIGGER AS $$
      DECLARE
          v_transaction_date DATE;
          v_menu_id INTEGER;
          v_branch_id INTEGER;
          v_company_id INTEGER;
          v_items_sold INTEGER;
          v_total_sales NUMERIC;
      BEGIN
          -- Assuming the 'completetransactions' table holds a reference to 'transactions'
          -- Fetch the transaction date, branch ID, and company ID from the 'transactions' table
          SELECT tr.transactiondate, tr.branchid, tr.companyid INTO v_transaction_date, v_branch_id, v_company_id
          FROM transactions tr
          WHERE tr.id = NEW.transactionid;

          -- Iterate through each menu item in the transaction to update or insert analytics data
          FOR v_menu_id, v_items_sold, v_total_sales IN
              SELECT i.menuid, SUM(i.count) AS items_sold, SUM(i.count * i.price) AS total_sales
              FROM items i
              WHERE i.transactionid = NEW.transactionid
              GROUP BY i.menuid
          LOOP
              -- Update existing analytics data or insert a new record if not present
              IF EXISTS (SELECT 1 FROM dailyitemanalytics WHERE date = v_transaction_date AND branchid = v_branch_id AND menuid = v_menu_id) THEN
                  UPDATE dailyitemanalytics
                  SET numberofitemssold = numberofitemssold + v_items_sold,
                      totalsales = totalsales + v_total_sales
                  WHERE date = v_transaction_date AND branchid = v_branch_id AND menuid = v_menu_id;
              ELSE
                  INSERT INTO dailyitemanalytics(date, companyid, branchid, menuid, numberofitemssold, totalsales)
                  VALUES (v_transaction_date, v_company_id, v_branch_id, v_menu_id, v_items_sold, v_total_sales);
              END IF;
          END LOOP;

          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
`))
    .then(() => knex.raw(`
      CREATE TRIGGER trigger_update_daily_item_analytics
      AFTER INSERT ON completetransactions
      FOR EACH ROW EXECUTE FUNCTION update_daily_item_analytics();
`));
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.raw('DROP TRIGGER IF EXISTS trigger_update_daily_analytics ON completetransactions;')
    .then(() => knex.raw('DROP FUNCTION IF EXISTS update_daily_item_analytics();'))
    .then(() => knex.schema.dropTableIfExists('dailyitemanalytics'));
};
