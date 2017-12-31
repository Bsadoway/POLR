exports.seed = function (knex, Promise) {
  return Promise.all([
    knex.raw('TRUNCATE TABLE polls RESTART IDENTITY CASCADE'),
    knex.raw('TRUNCATE TABLE voters RESTART IDENTITY CASCADE'),
    knex.raw('TRUNCATE TABLE poll_items RESTART IDENTITY CASCADE'),
    knex.raw('TRUNCATE TABLE submissions RESTART IDENTITY CASCADE'),

    knex('polls').insert([
      { creator: 'Creator111@example.com', poll_title: 'Title111', admin_url: '1/admin', poll_url: '1', is_open: true, irv_done: false, created_at: '2017-12-22 19:06:57.472486+00', updated_at: '2017-12-22 19:06:57.472486+00' },
      { creator: 'Creator222@example.com', poll_title: 'Title222', admin_url: '2/admin', poll_url: '2', is_open: true, irv_done: false, created_at: '2017-12-23 20:06:57.472486+00', updated_at: '2017-12-23 19:06:57.472486+00' },
      { creator: 'Creator333@example.com', poll_title: 'Title333', admin_url: '3/admin', poll_url: '3', is_open: true, irv_done: false, created_at: '2017-12-24 21:06:57.472486+00', updated_at: '2017-12-24 19:06:57.472486+00' },
      { creator: 'JohnSmith1@example.com', poll_title: 'What is the best flavor of ice cream?', admin_url: 'nf87cn/admin', poll_url: 'nu0tv2', is_open: true, irv_done: false, created_at: '2017-12-30 21:06:57.472486+00', updated_at: '2017-12-31 19:06:57.472486+00' },
      { creator: 'JaneDoe999@example.com', poll_title: 'You will be stranded on an island. You are allowed to bring one thing. What will you bring?', admin_url: 'r3gei5/admin', poll_url: 'g9devs', is_open: true, irv_done: false, created_at: '2017-12-29 21:06:57.472486+00', updated_at: '2017-12-30 19:06:57.472486+00' },
    ])
  ])
}
