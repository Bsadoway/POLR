const math = require('./math-functions');
const queries = require('./queries')
const sms = require('./sms');
const irv = require('./irv');
const mailgun = require('./mailgun');
const yelp = require('./yelp');

module.exports = {

  irv: (url, fastForward) => {
    return irv.isWinner(url)
      .then(result => {
        if (result) {
          return irv.changeState(url, true)
        } else {
          return irv.onlyTwoLeft(url)
            .then(result => {
              if (result) {
                return irv.changeState(url, true)
              } else {
                return queries.instantRunOff(url, fastForward)
                  .then(result => {                    
                    if (fastForward == 'true') {
                      return module.exports.irv(url, fastForward);
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
      // Submits votes based on sms input
      return queries.addVoter(sender)
        .then(voter_id => {
          const voteOrder = command.split('');
          return queries.vote(url, voteOrder, voter_id[0], sender)
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
    let creator = "";
    let isSMS = false;
    if (input.creator_email) {
      creator = input.creator_email;
    } else {
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
        irv_done: false
      })
      .into('polls')
      .returning(['id', 'admin_url', 'poll_url', 'poll_title', 'creator'])
      .then(poll_info => {
        return queries.pollInsert(poll_info, input)
      })
      .then((poll_info) => {
        // Sends SMS with admin and vote links if user entered SMS
        if (isSMS) {
          module.exports.sendAdminSMS(poll_info[0]);
        } else {
          // Sends email to user if they entered email
          mailgun.send(poll_info[0]);
        }
        return poll_info[0]
      });
  },

  submitVote: (url, input) => {
    const name = input.voter_name;
    const voteOrder = input.voteOrder;
    return queries.addVoter(name)
      .then(voter_id => {
        return queries.vote(url, voteOrder, voter_id[0])
      })
  },

  closePoll: (admin_url) => {
    return queries.closePoll(admin_url);
  },

  inviteFriends: (url, friends) => {
    return module.exports.getPoll(url)
      .then(result => {
        return Promise.all(friends.map((phoneNum) => {
          const recipient = math.cleanNumber(phoneNum);
          const creator = result[0].creator;
          const poll_url = result[0].poll_url;
          const poll_title = result[0].poll_title;
          const pollMessage = `${creator} wants to ask you about ${poll_title}!\n To vote visit: ${process.env.SERVER_URL}/${poll_url} or reply with: ${poll_url} vote`;
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
    const pollMessage = `${creator} wants to ask you about ${poll_title}!\n To vote visit: ${process.env.SERVER_URL}/${poll_url} or reply with: ${poll_url} vote`;
    sms.send(creator, adminMessage).then(() => sms.send(creator, pollMessage));
    return
  },
  
  resetIRV: (url) => {
    return queries.calculateRank(url, false)
      .then( () => {
        return irv.changeState(url, false)
      })
  },

  yelpCheck: (url) => {
    return yelp.find(url)
  }

}
