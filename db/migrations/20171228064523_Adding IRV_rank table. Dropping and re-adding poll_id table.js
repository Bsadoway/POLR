exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('poll_items', function (table) {
      // table.dropColumn('poll_id');
      table.integer('IRV_rank');
      // table.integer('poll_id').references('polls.id');
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('poll_items', function (table) {
      // table.dropColumn('poll_id');
      table.dropColumn('IRV_rank');
      // table.integer('poll_i``d').references('polls.id');
    })
  ])
}