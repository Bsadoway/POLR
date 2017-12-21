exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('polls', (table) => {
      table.increments();
      table.string('creator');
      table.string('poll_title');
      table.string('admin_url');
      table.string('poll_url');
      table.boolean('is_open');
      table.date('created_date');
    }),
    knex.schema.createTable('voters', (table) => {
      table.increments();
      table.string('phone_num');
      table.string('name');
    })
  ]).then(() =>
    knex.schema.createTable('poll_items', (table) => {
      table.increments();
      table.string('poll_item');
      table.string('description');
      table.integer('rank');
      table.integer('poll_id').references('polls.id');
    })
  ).then(() =>
    knex.schema.createTable('submissions', (table) => {
      table.increments();
      table.integer('item_id').references('poll_items.id');
      table.integer('voter_id').references('voters.id');
      table.integer('submitted_rank');
    })
  );
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('submissions'),
    knex.schema.dropTable('poll_items'),
    knex.schema.dropTable('voters'),
    knex.schema.dropTable('polls')

  ])
};
