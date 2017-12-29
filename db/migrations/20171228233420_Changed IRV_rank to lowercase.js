exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('poll_items', function (table) {
      table.dropColumn('IRV_rank');
      table.integer('irv_rank');
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('poll_items', function (table) {
      table.dropColumn('irv_rank');
      table.integer('IRV_rank');
    })
  ])
}