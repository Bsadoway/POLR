exports.seed = function (knex, Promise) {
  return Promise.all([
    knex.raw('TRUNCATE TABLE voters RESTART IDENTITY CASCADE'),
    knex('voters').insert({ phone_num: '000-000-0000', name: 'Voter1' }),
    knex('voters').insert({ phone_num: '111-111-1111', name: 'Voter2' }),
    knex('voters').insert({ phone_num: '222-222-2222', name: 'Voter3' }),

    knex('voters').insert({ phone_num: '333-333-3333', name: 'Voter4' }),
    knex('voters').insert({ phone_num: '444-444-4444', name: 'Voter5' }),
    knex('voters').insert({ phone_num: '555-555-5555', name: 'Voter6' }),

    knex('voters').insert({ phone_num: '666-666-6666', name: 'Voter7' }),
    knex('voters').insert({ phone_num: '777-777-7777', name: 'Voter8' }),
    knex('voters').insert({ phone_num: '888-888-8888', name: 'Voter9' }),
  ]);
}
