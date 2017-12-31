const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const twilioNumber = process.env.twilioNumber;
const twilio = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const math = require('./math-functions');

module.exports = {

  send: (recipient, message) => {
    return twilio.messages
      .create({
        to: recipient,
        from: twilioNumber,
        body: message
      })
      .then((message) => console.log(message.sid));
  },

  sendPoll: (url, recipient) => {
    return global.knex
      .select()
      .from('polls')
      .join('poll_items', { 'poll_items.poll_id': 'polls.id' })
      .where({ 'poll_url': url })
      .orWhere({ 'admin_url': url })
      .orderBy('poll_items.id', 'asc')
      .then(result => {
        if (result.length !== 0) {
          const itemList = math.listBuilder(result).join(" ");
          const responseMsg = `${result[0].poll_title}\n${itemList}\nTo vote, reply with the poll code and your votes ordered from HIGHEST -> LOWEST rank: ${result[0].poll_url} 1234`;
          return module.exports.send(recipient, responseMsg);
        } else {
          const responseMsg = "Invalid command";
          return sms.send(recipient, responseMsg);
        }
      })
  }


}
