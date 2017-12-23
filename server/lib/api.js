const math = require('./math-functions');
const dateFormat = require('dateformat');

module.exports = {

  getEverything: () => {
    return global.knex
      .select()
      .from('polls')
  },

  createPoll: (input) => {
    return global.knex
      .insert({
        creator: input.creator,
        poll_title: input.title,
        admin_url: `${math.generateRandomString()}/admin`,
        poll_url: `${math.generateRandomString()}`,
        is_open: true,
      })
      .into('polls')
      .returning('id')
      .then(function (id) {
        pollInsert(id, input);
      });
    // TODO: Add error throwing if initial post creation fails so that step 2 isn't taken
  },

  getPoll: (url) => {
    return global.knex
      .select()
      .from('polls')
      .join('poll_items', { 'poll_items.poll_id': 'polls.id' })
      .where({'polls.poll_url': url })
      .orWhere({'polls.admin_url': url})
  },

  inviteFriends: (friends) => {
    return Promise.all(friends.map((phoneNum) => {
      return global.knex
        .insert({
          phone_num: phoneNum
        })
        .into('voters')
    }));
  },


  closePoll: (url) => {
    return global.knex
      .select('is_open')
      .from('polls')
      .where({'admin_url': url})
      .update({
          is_open: false
    })
  },

  submitVote: () => {

  }


}

function pollInsert(id, input) {
  Promise.all(input.item.map((item) => {
    return global.knex
      .insert({
        poll_item: item,
        rank: 0,
        poll_id: id[0]
      })
      .into('poll_items')
  }));
}
