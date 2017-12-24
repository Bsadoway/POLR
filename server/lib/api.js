const math = require('./math-functions');
const sms = require('./sms');

module.exports = {
  
  incomingSMS: (message) => {
    const sender = message.From;
    const body = message.Body;
    const poll_id = body.split(" ")[0].toLowerCase();
    const command = body.split(" ")[1].toLowerCase();
    // console.log(poll_id);
    // console.log(command);
    if (command === 'c') {
      return global.knex
        .select('is_open')
        .from('polls')
        .where({ 'id': poll_id })
        .update({
          is_open: false
        })
    }
    return
  },

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
      .returning(['id', 'admin_url', 'poll_url','poll_title'])
      .then( id => {
        pollInsert(id, input);
        return id[0]
      })
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
  },

  sendAdminSMS: (adminInfo) => {
    const poll_id = adminInfo.id;
    const admin_url = adminInfo.admin_url;
    const poll_url = adminInfo.poll_url;
    const poll_title = adminInfo.poll_title;
    const adminMessage = `Survey created with POLR! Your admin link is: http://localhost:8080/${admin_url}. To close the poll reply with: ${poll_id} c`;
    const pollMessage = `CREATOR has made a survey about "${poll_title}"! To vote visit: http://localhost:8080/${poll_url} or reply with ${poll_id} t`;
    sms.send(adminMessage).then(() => sms.send(pollMessage));
    return
  }

}

function pollInsert(id, input) {
  Promise.all(input.item.map((item) => {
    return global.knex
      .insert({
        poll_item: item,
        rank: 0,
        poll_id: id[0].id
      })
      .into('poll_items')
      .returning('poll_item');
  }));
}

function closePollID (poll_id) {
  console.log("close poll id function");
  return global.knex
    .select('is_open')
    .from('polls')
    .where({ 'id': poll_id })
    .update({
      is_open: false
    })
}