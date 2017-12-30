require('dotenv');
const mg_api = process.env.MAILGUN_API;
const mg_domain = process.env.MAILGUN_DOMAIN;
const mg_from = process.env.MAILGUN_FROM;
const mg_to = process.env.MAILGUN_TO;
const mailgun = require('mailgun-js')({ apiKey: mg_api, domain: mg_domain });
const path = require('path');
const img = path.join(__dirname, '/../../public/POLR-logo.png');
const server_url = process.env.SERVER_URL;

module.exports = {

  send: (poll_info) => {
    console.log('attempting to send message with mailgun');

    const creator = poll_info.creator;
    const admin_url = poll_info.admin_url;
    const poll_url  = poll_info.poll_url;

    const data = {
      from: mg_from,
      to: creator,
      subject: 'Your new POLR survey',
      html: `<html>Thanks for using POLR!\n<br><br> You can access and administer your survey at:<br> ${server_url}/${admin_url}. \n<br><br> Invite your friends to vote using this link:<br> http://localhost:8080/${poll_url}</html>`,
      attachment: img
    };

    return mailgun.messages().send(data, function (error, body) {
      if (error) {
        console.log('Error', error)
      } else {
        console.log(body);        
      }
    });
  }


}

