exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('polls', function (table) {
      table.boolean('irv_done');
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('polls', function (table) {
      table.dropColumn('irv_done');
    })
  ])
}