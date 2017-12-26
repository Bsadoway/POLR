const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const myPhone = process.env.CellF;
const twilioNumber = process.env.twilioNumber;
const twilio = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

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
  }

}
