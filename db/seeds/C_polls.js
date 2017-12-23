exports.seed = function (knex, Promise) {
  return Promise.all([
    knex.raw('TRUNCATE TABLE polls RESTART IDENTITY CASCADE'),
    knex('polls').insert({ creator: 'Creator123@example.com', poll_title: 'Title123', admin_url: '1/admin', poll_url: '1', is_open: true, created_at: '2017-12-22 19:06:57.472486+00', updated_at: '2017-12-22 19:06:57.472486+00' }),
    knex('polls').insert({ creator: 'CreatorABC@example.com', poll_title: 'TitleABC', admin_url: '2/admin', poll_url: '2', is_open: true, created_at: '2017-12-23 20:06:57.472486+00', updated_at: '2017-12-23 19:06:57.472486+00' }),
    knex('polls').insert({ creator: 'CreatorA1B2C3@example.com', poll_title: 'TitleA1B2C3', admin_url: '3/admin', poll_url: '3', is_open: true, created_at: '2017-12-24 21:06:57.472486+00', updated_at: '2017-12-24 19:06:57.472486+00' }),
  ]);
}
