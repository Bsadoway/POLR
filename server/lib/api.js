const math = require('./math-functions');
const sms = require('./sms');

module.exports = {

  // Issues actions based on incoming SMS
  incomingSMS: (message) => {
    const sender = message.From;
    const body = message.Body;
    const poll_id = body.split(" ")[0].toLowerCase();
    const command = body.split(" ")[1].toLowerCase();
    // Closes poll
    if (command === 'c') {
      return checkIfAdmin(poll_id, sender)
    }
    // Sends poll info to voter via SMS
    if (command === 't') {
      return sendPoll(poll_id, sender)
    }
    return
  },

  instantRun: () => {
    // return math.instantRunOff();
    // return instantRunOff();
  },

  getEverything: () => {
    return global.knex
      .select()
      .from('polls')
  },

  // Sets rank for poll items based on submitted ranks
  getRank: () => {
    // return instantRunOff();
    return math.calculateRank(3);
  },

  runOff: () => {
    return math.instantRunOff(3);
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
      .returning(['id', 'admin_url', 'poll_url', 'poll_title'])
      .then(id => {
        pollInsert(id, input);
        return id[0]
      })
    // TODO: Add error throwing if initial post creation fails so that step 2 isn't taken
  },

  // Retrieves poll information based on provided URL
  getPoll: (url) => {
    return global.knex
      .select()
      .from('polls')
      .join('poll_items', { 'poll_items.poll_id': 'polls.id' })
      .where({ 'polls.poll_url': url })
      .orWhere({ 'polls.admin_url': url })
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
      .where({ 'admin_url': url })
      .update({
        is_open: false
      })
  },

  submitVote: () => {
  },

  // Sends 2 SMS to admin with admin_url and poll_url
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

function closePollID(poll_id) {
  return global.knex
    .select('is_open')
    .from('polls')
    .where({ 'id': poll_id })
    .update({
      is_open: false
    })
}

// Checks if SMS sender is authorized to administer poll
function checkIfAdmin(id, sender) {
  return global.knex
    .select()
    .from('polls')
    .where({ 'id': id })
    .andWhere({ 'creator': sender })
    .then(result => {
      if (result.length !== 0) {
        console.log('Success. Matched poll_id and sender');
        return global.knex
          .select('is_open')
          .from('polls')
          .where({ 'id': id })
          .update({
            is_open: false
          })
      } else {
        console.log('Wrong poll id or unauthorized command');
        // const responseMsg = "Invalid command";
        // return sms.send(responseMsg);
        return
      }
    })
}

// Sends list of poll items to voter for SMS based voting
function sendPoll(id, sender) {
  return global.knex
    .select()
    .from('polls')
    .join('poll_items', { 'poll_items.poll_id': 'polls.id' })
    .where({ 'polls.id': 3 })
    .then(result => {
      if (result.length !== 0) {
        // console.log('Success. Matched poll_id and sender');
        const itemList = math.listBuilder(result).join(" ");
        const responseMsg = `Poll title - List of items: ${itemList}. Vote now by saying:`;
        console.log('response msg is: ');
        console.log(responseMsg);
        return
        // return sms.send(responseMsg);
      } else {
        console.log('Wrong poll id ornauthorized command');
        // const responseMsg = "Invalid command";
        // return sms`.send(responseMsg);
        return
      }
    }) 
}

function instantRunOff() {
  return global.knex.raw('SELECT poll_item FROM poll_items WHERE poll_id = 2 AND rank = (SELECT MAX(rank) FROM poll_items WHERE poll_id = 2)')
    .then(result => { 
      // console.log(result.rows[0].poll_item); 
      return result.rows[0].poll_item 
    });
}

/*
instantRunOff

1. Check if top ranked is > 50% of total items
  if yes > winner.
  if no > step 2.
2. Find lowest ranked item
3. Find the rank 2 votes of everyone who voted for the loser

// lowest ranked item
global.knex.raw('SELECT poll_item FROM poll_items WHERE poll_id = 2 AND rank = (SELECT MAX(rank) FROM poll_items WHERE poll_id = 2)')
    .then(result => { return rows[0].poll_item });


// finds 2nd ranked item
    return global.knex
      .select('poll_items.id')
      .count('submitted_rank')
      .from('submissions')
      .where({ 'voter_id': result.voter_id })
      .andWhere({ 'submitted_rank': 2 })
      .groupBy('poll_items.id')

// based on lowest ranked item, finds the submitters
return global.knex
  .select('voter_id')
  .from('submissions')
  .join('poll_items', { 'submissions.item_id': 'poll_items.id' })
  .where({poll_items.poll_item: resul})
  .then( result => {
    Promise
        return global.knex
      .select('poll_items.id')
      .count('submitted_rank')
      .from('submissions')
      .where({ 'voter_id': result.voter_id })
      .andWhere({ 'submitted_rank': 2 })
      .groupBy('poll_items.id')
  })



*/