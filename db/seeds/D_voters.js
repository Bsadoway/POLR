exports.seed = function (knex, Promise) {
  return Promise.all([
    knex.raw('TRUNCATE TABLE voters RESTART IDENTITY CASCADE'),
    knex('voters').insert([
      { phone_num: '000-000-0000', name: 'Voter1' },
      { phone_num: '111-111-1111', name: 'Voter2' },
      { phone_num: '222-222-2222', name: 'Voter3' },

      { phone_num: '333-333-3333', name: 'Voter4' },
      { phone_num: '444-444-4444', name: 'Voter5' },
      { phone_num: '555-555-5555', name: 'Voter6' },

      { phone_num: '666-666-6666', name: 'Voter7' },
      { phone_num: '777-777-7777', name: 'Voter8' },
      { phone_num: '888-888-8888', name: 'Voter9' },

      { phone_num: '101-101-1010', name: 'Voter10' },
      { phone_num: '110-110-1100', name: 'Voter11' },
      { phone_num: '121-212-1212', name: 'Voter12' }
    ])
  ]);
}
