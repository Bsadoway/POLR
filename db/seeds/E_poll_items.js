exports.seed = function (knex, Promise) {
  return Promise.all([
    knex.raw('TRUNCATE TABLE poll_items RESTART IDENTITY CASCADE'),

    knex('poll_items').insert({ poll_item: 'Poll Title 1-1', description: 'Description 1-1', rank: 0, poll_id: 1 }),
    knex('poll_items').insert({ poll_item: 'Poll Title 1-2', description: 'Description 1-2', rank: 0, poll_id: 1 }),
    knex('poll_items').insert({ poll_item: 'Poll Title 1-3', description: 'Description 1-3', rank: 0, poll_id: 1 }),

    knex('poll_items').insert({ poll_item: 'Poll Title 2-1', description: 'Description 2-1', rank: 0, poll_id: 2 }),
    knex('poll_items').insert({ poll_item: 'Poll Title 2-2', description: 'Description 2-2', rank: 0, poll_id: 2 }),
    knex('poll_items').insert({ poll_item: 'Poll Title 2-3', description: 'Description 2-3', rank: 0, poll_id: 2 }),

    knex('poll_items').insert({ poll_item: 'Poll Title 3-1', description: 'Description 3-1', rank: 0, poll_id: 3 }),
    knex('poll_items').insert({ poll_item: 'Poll Title 3-2', description: 'Description 3-2', rank: 0, poll_id: 3 }),
    knex('poll_items').insert({ poll_item: 'Poll Title 3-3', description: 'Description 3-3', rank: 0, poll_id: 3 }),
  ]);
}
