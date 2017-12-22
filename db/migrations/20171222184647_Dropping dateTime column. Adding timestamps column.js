exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('polls', function (table) {
            table.dropColumn('created_date');
            table.timestamps(true,true);
        })
    ])
}
exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('polls', function (table) {
            table.dropColumn('created_at');
            table.dropColumn('updated_at');
            table.dateTime('created_date');
        })
    ])
}