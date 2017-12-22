exports.up = function(knex, Promise) {
  return Promise.all([
      knex.schema.table('polls', function (table) {
        table.dropColumn('created_date');
    })
  ])
}

exports.down = function(knex, Promise) {
  return Promise.all([
      knex.schema.table('polls', function (table) {
      table.date('created_date');
    })
  ])
}
