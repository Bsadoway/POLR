exports.seed = function (knex, Promise) {
  return Promise.all([
    knex.raw('TRUNCATE TABLE submissions RESTART IDENTITY CASCADE'),
    knex('submissions').insert([
      { item_id: '1', voter_id: '1', submitted_rank: 1 },
      { item_id: '1', voter_id: '2', submitted_rank: 1 },
      { item_id: '1', voter_id: '3', submitted_rank: 1 },

      { item_id: '2', voter_id: '1', submitted_rank: 2 },
      { item_id: '2', voter_id: '2', submitted_rank: 2 },
      { item_id: '2', voter_id: '3', submitted_rank: 2 },


      { item_id: '3', voter_id: '1', submitted_rank: 3 },
      { item_id: '3', voter_id: '2', submitted_rank: 3 },
      { item_id: '3', voter_id: '3', submitted_rank: 3 },

      /////////////////////////////////////////////////////////////////////////////////////////////////////

      { item_id: '4', voter_id: '4', submitted_rank: 1 },
      { item_id: '4', voter_id: '5', submitted_rank: 2 },
      { item_id: '4', voter_id: '6', submitted_rank: 3 },


      { item_id: '5', voter_id: '4', submitted_rank: 2 },
      { item_id: '5', voter_id: '5', submitted_rank: 1 },
      { item_id: '5', voter_id: '6', submitted_rank: 1 },

      { item_id: '6', voter_id: '4', submitted_rank: 3 },
      { item_id: '6', voter_id: '5', submitted_rank: 3 },
      { item_id: '6', voter_id: '6', submitted_rank: 2 },

      /////////////////////////////////////////////////////////////////////////////////////////////////////

      { item_id: '7', voter_id: '7', submitted_rank: 1 },
      { item_id: '7', voter_id: '8', submitted_rank: 1 },
      { item_id: '7', voter_id: '9', submitted_rank: 1 },
      { item_id: '7', voter_id: '10', submitted_rank: 3 },
      { item_id: '7', voter_id: '11', submitted_rank: 3 },
      { item_id: '7', voter_id: '12', submitted_rank: 3 },


      { item_id: '8', voter_id: '7', submitted_rank: 2 },
      { item_id: '8', voter_id: '8', submitted_rank: 2 },
      { item_id: '8', voter_id: '9', submitted_rank: 2 },
      { item_id: '8', voter_id: '10', submitted_rank: 1 },
      { item_id: '8', voter_id: '11', submitted_rank: 1 },
      { item_id: '8', voter_id: '12', submitted_rank: 2 },


      { item_id: '9', voter_id: '7', submitted_rank: 3 },
      { item_id: '9', voter_id: '8', submitted_rank: 3 },
      { item_id: '9', voter_id: '9', submitted_rank: 3 },
      { item_id: '9', voter_id: '10', submitted_rank: 2 },
      { item_id: '9', voter_id: '11', submitted_rank: 2 },
      { item_id: '9', voter_id: '12', submitted_rank: 1 }

    ])
  ]);
}
