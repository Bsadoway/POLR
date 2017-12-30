const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const myPhone = process.env.CellF;
const twilioNumber = process.env.twilioNumber;
const twilio = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const math = require('./math-functions');

module.exports = {

  send: (message) => {
    return twilio.messages
      .create({
        to: myPhone,
        from: twilioNumber,
        body: message
        // mediaUrl: 'https://static.boredpanda.com/blog/wp-content/uploads/2016/08/cute-kittens-30-57b30ad41bc90__605.jpg',
      })
      .then((message) => console.log(message.sid));
  },

  twimlRespond: () => {
    const twiml = new MessagingResponse();
    twiml.message();
    res.writeHead(204, { 'Content-type': 'text/xml' });
    res.end(twiml.toString());
    return
  },

  sendPoll: (url, sender) => {
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
          const responseMsg = `${result[0].poll_title}\n${itemList}\nTo vote, reply with the poll code and your votes ordered from highest to lowest ranked choice: ${result[0].poll_url} 1234`;
          console.log('response msg is: ');
          console.log(responseMsg);
          return
          // return module.exports.send(responseMsg);
        } else {
          console.log('Wrong poll id ornauthorized command');
          // const responseMsg = "Invalid command";
          // return sms`.send(responseMsg);
          return
        }
      })
  }


}
