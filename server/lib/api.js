const math = require('./math-functions');
const queries = require('./queries')
const sms = require('./sms');
const irv = require('./irv');
const mailgun = require('./mailgun');

module.exports = {

  // TESTING FUNCTION
  testFunction: (url, fastForward) => {
    return module.exports.irv(url, fastForward);
    // return module.exports.getPoll(url);
    // return mailgun.send(poll_info);
  },

  irv: (url, fastForward) => {
    console.log('going through irv round first line')
    return irv.isWinner(url)
      .then(result => {
        if (result) {
          console.log('winner');
          return result
        } else {
          console.log('no winner. checking if only 2 left');
          return irv.onlyTwoLeft(url)
            .then(result => {
              if (result) {
                console.log('its a tie!');
                return result
              } else {
                console.log('its NOT a tie! Running irv round');
                return queries.instantRunOff(url, fastForward)
                  .then(result => {
                    if (fastForward) {
                      return module.exports.irv(url);
                    } else {
                      return result
                    }
                  })
              }
            })
        }
      })
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
    console.log('input is');
    console.log(input);
    console.log(input.creator_email);
    let creator = "";
    let isSMS = false;
    if (input.creator_email) {
      creator = input.creator_email;
    } else {
      // const sms = input.creator_sms.replace(/\D/g, ''); 
      // creator = `+1${sms}`;
      creator = math.cleanNumber(input.creator_sms);
      isSMS = true;
    }
    return global.knex
      .insert({
        creator: creator,
        poll_title: input.title,
        admin_url: `${math.generateRandomString()}/admin`,
        poll_url: `${math.generateRandomString()}`,
        is_open: true,
      })
      .into('polls')
      .returning(['id', 'admin_url', 'poll_url', 'poll_title', 'creator'])
      .then(poll_info => {
        return queries.pollInsert(poll_info, input)
      })
      .then((poll_info) => {
        if (isSMS) {
          console.log('its an sms')
          console.log(poll_info[0]);
          module.exports.sendAdminSMS(poll_info[0]);
        } else {
          console.log('its an email')
          mailgun.send(poll_info[0]);
        }
        return poll_info[0]
      });
  },

  inviteFriends: (url, friends) => {
    return module.exports.getPoll(url)
      .then(result => {
        return Promise.all(friends.map((phoneNum) => {
          console.log('trying to map')
          const recipient = math.cleanNumber(phoneNum);
          const creator = result[0].creator;
          const poll_url = result[0].poll_url;
          const poll_title = result[0].poll_title;
          const pollMessage = `${creator} wants to ask you about ${poll_title}! To vote visit: ${process.env.SERVER_URL}/${poll_url} or reply with ${poll_url} vote`;
          return sms.send(recipient, pollMessage)
        }));
      })
      .catch(result => {
        return
      })

  },

  // Sends 2 SMS to admin with admin_url and poll_url
  sendAdminSMS: (adminInfo) => {
    const creator = adminInfo.creator;
    const poll_id = adminInfo.id;
    const admin_url = adminInfo.admin_url;
    const poll_url = adminInfo.poll_url;
    const poll_title = adminInfo.poll_title;
    const adminMessage = `You created a survey with POLR!\nYour admin link is: ${process.env.SERVER_URL}/${admin_url}\nTo close the poll reply with: ${admin_url} close\nForward the link below to invite your friends!`;
    const pollMessage = `${creator} wants to ask you about ${poll_title}! To vote visit: ${process.env.SERVER_URL}/${poll_url} or reply with ${poll_url} vote`;
    sms.send(creator, adminMessage).then(() => sms.send(creator, pollMessage));
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


}
