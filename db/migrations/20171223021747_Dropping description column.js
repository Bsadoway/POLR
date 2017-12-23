exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.table('poll_items', function (table) {
            table.dropColumn('description');
        })
    ])
}
exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.table('poll_items', function (table) {
            table.string('description');
        })
    ])
}