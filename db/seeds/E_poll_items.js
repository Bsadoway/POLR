exports.seed = function (knex, Promise) {
  return Promise.all([
    knex.raw('TRUNCATE TABLE poll_items RESTART IDENTITY CASCADE'),
    knex('poll_items').insert([
      { poll_item: 'Poll_item 1-1', rank: 3, poll_id: 1 },
      { poll_item: 'Poll_item 1-2', rank: 0, poll_id: 1 },
      { poll_item: 'Poll_item 1-3', rank: 0, poll_id: 1 },
      
      { poll_item: 'Poll_item 2-1', rank: 1, poll_id: 2 },
      { poll_item: 'Poll_item 2-2', rank: 2, poll_id: 2 },
      { poll_item: 'Poll_item 2-3', rank: 0, poll_id: 2 },

      { poll_item: 'Poll_item 3-1', rank: 3, poll_id: 3 },
      { poll_item: 'Poll_item 3-2', rank: 2, poll_id: 3 },
      { poll_item: 'Poll_item 3-3', rank: 1, poll_id: 3 },
    ])
  ])
}
