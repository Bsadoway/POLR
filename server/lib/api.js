const math = require('./math-functions');
const sms = require('./sms');

module.exports = {
  
  incomingSMS: (message) => {
    const sender = message.From;
    const body = message.Body;
    const poll_id = body.split(" ")[0];
    const command = body.split(" ")[1];
    console.log(poll_id);
    console.log(command);
    if (command === '1') {
      return global.knex
        .select('is_open')
        .from('polls')
        .where({ 'id': poll_id })
        .update({
          is_open: false
        })
        .then(() => {
          sms.twimlRespond();
        })
    }
    // sms.twimlRespond();
    return;

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
      .returning('id', 'admin_url', 'poll_url')
      .then( id => {
        pollInsert(id, input);
      })
      // .then((admin_url) => sms.sendAdminUrl()
      // );
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

function sendSMS () {
  twilio.messages
    .create({
      to: myPhone,
      from: twilioNumber,
      body: 'Sending a message from POLR!!',
      // mediaUrl: 'https://static.boredpanda.com/blog/wp-content/uploads/2016/08/cute-kittens-30-57b30ad41bc90__605.jpg',
    })
    .then((message) => console.log(message.sid));
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