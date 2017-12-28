const math = require('./math-functions');
const sms = require('./sms');
const queries = require('./queries')

module.exports = {

  // Issues actions based on incoming SMS
  incomingSMS: (message) => {
    const sender = message.From;
    const body = message.Body;
    const poll_id = body.split(" ")[0].toLowerCase();
    const command = body.split(" ")[1].toLowerCase();
    // Closes poll
    if (command === 'close') {
      return checkIfAdmin(poll_id, sender)
    }
    // Sends poll info to voter via SMS
    if (command === 'view') {
      const voteOrder = command.split('');
      return sms.sendPoll(poll_id, sender)
    } else {
      // return Promise.all([
        return queries.addVoter(sender)
        .then( voter_id => {
          // console.log('id is:')
          // console.log(voter_id[0]);
          const voteOrder = command.split('');
          return queries.vote(poll_id, voteOrder, voter_id[0])
      // ])
        })
    }
    return
  },

  getEverything: () => {
    return global.knex
      .select()
      .from('polls')
  },

  // TESTING FUNCTION
  testFunction: () => {
    // const TestArray = {a:1, b:2, '3':4, '4':3, '2':1, '1':0, 'q':3, '10':390};
    // return module.exports.submitVote('1', TestArray)
    // return queries.instantRunOff(3);
    return queries.calculateRank(1);
    // return queries.onlyTwoLeft(3)
  },

  runOff: () => {
    return queries.isWinner()
      .then(result => {
        if (result) {
          console.log('winner');
          return true
        } else {
          console.log('no winner. running instant run-off round');
          if (queries.onlyTwoLeft(3)) {
            const tieSelector = math.randomSelect;
            return global.knex
              .select('poll_item')
              .count('rank')
              .from('poll_items')
              .where
          }
          return queries.instantRunOff(3)
            .then(() => {
              runOff()
            })
        }
      })
    // return queries.instantRunOff(3);
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

  submitVote: (url, input) => {
    const name = input.voter_name;
    const voteOrder = input.voteOrder;
    return queries.addVoter(name)
      .then(voter_id => {
        return queries.vote(url, voteOrder, voter_id[0])
      })
  },

  // Sends 2 SMS to admin with admin_url and poll_url
  sendAdminSMS: (adminInfo) => {
    const poll_id = adminInfo.id;
    const admin_url = adminInfo.admin_url;
    const poll_url = adminInfo.poll_url;
    const poll_title = adminInfo.poll_title;
    const adminMessage = `Survey created with POLR! Your admin link is: http://localhost:8080/${admin_url}. To close the poll reply with: ${poll_id} close`;
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
    .where({ 'polls.id': id })
    .orderBy('poll_items.id', 'asc')
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
