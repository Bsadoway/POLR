const math = require('./math-functions');
const queries = require('./queries')
const sms = require('./sms');

module.exports = {

  // TESTING FUNCTION
  testFunction: (url) => {
    // const TestArray = {a:1, b:2, '3':4, '4':3, '2':1, '1':0, 'q':3, '10':390};
    // return module.exports.submitVote('1', TestArray)
    return queries.instantRunOff(url);
    // return queries.calculateRank(url);
    // return queries.onlyTwoLeft(3)
  },

  // Issues actions based on incoming SMS
  incomingSMS: (message) => {
    const sender = message.From;
    const body = message.Body;
    const url = body.split(" ")[0].toLowerCase();
    const command = body.split(" ")[1].toLowerCase();
    // Closes poll
    if (command === 'close') {
      return queries.checkIfAdmin(url, sender)
    }
    // Sends poll info to voter via SMS
    if (command === 'vote') {
      const voteOrder = command.split('');
      return sms.sendPoll(url, sender)
    } else {
      // return Promise.all([
      return queries.addVoter(sender)
        .then(voter_id => {
          // console.log('id is:')
          // console.log(voter_id[0]);
          const voteOrder = command.split('');
          return queries.vote(url, voteOrder, voter_id[0])
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

  // Retrieves poll information based on provided URL and calculates ranks for poll items
  getPoll: (url) => {
    return queries.calculateRank(url, true)
      .then(() => {
        return global.knex
          .select()
          .from('polls')
          .join('poll_items', { 'poll_items.poll_id': 'polls.id' })
          .where({ 'polls.poll_url': url })
          .orWhere({ 'polls.admin_url': url })
          .orderBy('poll_items.id', 'asc')
      })
  },

  // Admin APIs
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
      .returning(['id', 'admin_url', 'poll_url', 'poll_title', 'creator'])
      .then(poll_info => {
        queries.pollInsert(poll_info, input);
        return poll_info[0]
      })
    // TODO: Add error throwing if initial post creation fails so that step 2 isn't taken
  },

  inviteFriends: (url, friends) => {
    return Promise.all(friends.map((phoneNum) => {
      return sms.sendPoll(url, phoneNum)
    }));
  },

  // Sends 2 SMS to admin with admin_url and poll_url
  sendAdminSMS: (adminInfo) => {
    const creator = adminInfo.creator;
    const poll_id = adminInfo.id;
    const admin_url = adminInfo.admin_url;
    const poll_url = adminInfo.poll_url;
    const poll_title = adminInfo.poll_title;
    const adminMessage = `You created a survey with POLR!\nYour admin link is: http://localhost:8080/${admin_url}\nTo close the poll reply with: ${poll_id} close`;
    const pollMessage = `${creator} wants to ask you about ${poll_title}! To vote visit: http://localhost:8080/${poll_url} or reply with ${poll_id} vote`;
    sms.send(adminMessage).then(() => sms.send(pollMessage));
    return
  },

  closePoll: (admin_url) => {
    return queries.closePoll(admin_url);
  },

  submitVote: (url, input) => {
    const name = input.voter_name;
    const voteOrder = input.voteOrder;
    return queries.addVoter(name)
      .then(voter_id => {
        return queries.vote(url, voteOrder, voter_id[0])
      })
  },

  finalResult: () => {
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
  }

}
