/* eslint-disable func-names */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('items', (table) => {
    table.increments('id').primary();
    table.integer('count');
    table.float('price');
    table.float('totalprice');
    table.integer('menuid').unsigned();
    table.integer('transactionid').unsigned();
    table.string('category');
    table.string('pricingcategory');

    // Foreign key constraints
    table.foreign('menuid').references('id').inTable('menus').onUpdate('NO ACTION')
      .onDelete('NO ACTION');
    table.foreign('transactionid').references('id').inTable('transactions').onUpdate('NO ACTION')
      .onDelete('NO ACTION');
  })
    // Knex does not have built-in support for creating triggers directly,
    // so you would typically run a raw SQL query to create the trigger.
    .then(() => knex.raw(`
    CREATE OR REPLACE FUNCTION public.update_item_details() RETURNS trigger AS $$
    BEGIN
      -- Function logic here
    END;
    $$ LANGUAGE plpgsql;
  `))
    .then(() => knex.raw(`
    CREATE TRIGGER trigger_update_item_details
    AFTER INSERT OR UPDATE ON public.items
    FOR EACH ROW EXECUTE FUNCTION public.update_item_details();
  `));
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  // Drop the trigger and the table in the down migration
  return knex.raw('DROP TRIGGER IF EXISTS trigger_update_item_details ON public.items;')
    .then(() => knex.raw('DROP FUNCTION IF EXISTS public.update_item_details();'))
    .then(() => knex.schema.dropTableIfExists('items'));
};
