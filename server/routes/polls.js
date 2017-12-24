"use strict";

const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const sms = require('../lib/sms');

module.exports = (API) => {

// Testing route for receiving SMS
  router.post('/sms', (req, res) => {
    const sms = req.body;
    API.incomingSMS(sms)
      .then(responseMsg => {
        res.end();
        // const twiml = new MessagingResponse();
        // twiml.message();
        // res.writeHead(204, {'Content-type': 'text/xml'});
        // res.end(twiml.toString());
      .catch(err => console.log(err))
  });

    // Below is used to send SMS back, a response is always required (even if no msg content)
  //   const twiml = new MessagingResponse();
  //   twiml.message();

  //   res.writeHead(204, {'Content-type': 'text/xml'});
  //   res.end(twiml.toString());
  // });

  router.get("/", (req, res) => {
    API.getEverything()
      .then(result => res.render('index'))
      .catch(err => res.render('vote'))
  });

  router.post("/", (req, res) => {
    API.createPoll(req.body)
      .then(result => res.render('index'))
      .catch(err => res.render('index'))
  });

/////////// ADMIN ROUTES /////////////////////////////////////

  router.get('/:poll/admin', (req, res) => {
    const url = `${req.params.poll}/admin`;
    API.getPoll(url)
      .then(result => {
        console.log(result);
        res.render('admin', {'result': result})
      })
      .catch(err => res.render('vote'))
  });

  // Inviting friends
  router.post('/:poll/admin', (req, res) => {
    const url = `${req.params.poll}/admin`;
    const friends = req.body.friends;
    API.inviteFriends(friends)
      .then(result => {
        console.log(result);
        res.render('admin', { 'result': result })
      })
      .catch(err => res.render('admin'))
  });

  // Closes poll
  router.put('/:poll/admin', (req, res) => {
    const url = `${req.params.poll}/admin`;
    API.closePoll(url)
      .then(result => res.render('admin', { 'result': result }))
      .catch(err => res.render('vote'))
  });

/////////// VOTER ROUTES /////////////////////////////////////

  router.get('/:poll', (req, res) => {
    const url = req.params.poll;
    console.log(url);
    API.getPoll(url)
      .then(result => {
        console.log('result is: ');
        console.log(result);
        res.render('vote', {'result': result})
      })
      .catch(err => res.render('vote'))
  });

  router.post('/:poll', (req, res) => {
    const url = req.params.poll;
    console.log(url);
    API.submitVote(url)
      .then(result => res.render('admin', { 'vars': 'var1' }))
      .catch(err => res.render('vote'))
  });
  return router;
}
