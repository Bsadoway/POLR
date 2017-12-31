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
        // res.end();
        const twiml = new MessagingResponse();
        twiml.message();
        res.writeHead(204, {'Content-type': 'text/xml'});
        res.end(twiml.toString());
      })
      .catch(err => console.log(err))
  });

  // Testing route
  router.get("/:poll/test", (req, res) => {
      const url = req.params.poll;
      API.testFunction(url)
      .then(result => {
        console.log(result);
        res.render('test', { 'result': result })
        // res.render('index');
      })
      .catch(err => res.render('vote'))
  });

  router.get("/", (req, res) => {
    API.getEverything()
      .then(result => {
        console.log(result);
        res.render('index');
      })
      .catch(err => res.render('vote'))
  });

  router.post("/", (req, res) => {
    // console.log(req.body);
    API.createPoll(req.body)
      .then(result => {
        console.log('after create result is');
        console.log(result);
        // API.sendAdminSMS(result);
        res.redirect(`/${result.admin_url}`);
      })
      .catch(err => res.render('index'))
  });

/////////// ADMIN ROUTES /////////////////////////////////////

  router.get('/:poll/admin', (req, res) => {
    const admin_url = `${req.params.poll}/admin`;
    API.getPoll(admin_url)
      .then(result => {
        console.log(result);
        res.render('admin', {'result': result})
      })
      .catch(err => res.render('vote'))
  });

  // Inviting friends
  router.post('/:poll/admin', (req, res) => {
    const admin_url = `${req.params.poll}/admin`;
    const friends = req.body.friends;
    API.inviteFriends(admin_url, friends)
      .then(result => {
        console.log(result);
        res.redirect(`/${url}`)
        // res.render('admin', { 'result': result })
      })
      .catch(err => res.render('admin'))
  });

  // Closes poll
  router.put('/:poll/admin', (req, res) => {
    const url = `${req.params.poll}/admin`;
    API.closePoll(url)
      .then(result => {
        // console.log("log of result is:");
        // console.log(result);
        res.render('index', { 'result': result })
      })
      .catch(err => res.render('vote'))
  });

/////////// VOTER ROUTES /////////////////////////////////////

  router.get('/:poll', (req, res) => {
    const url = req.params.poll;
    API.getPoll(url)
      .then(result => {
        res.render('vote', {'result': result, 'url': url})
      })
      .catch(err => res.render('vote'))
  });

  router.post('/:poll', (req, res) => {
    const url = req.params.poll;
    console.log(req.body);
    API.submitVote(url, req.body)
      .then(result => res.redirect(`/${url}/results`))
      .catch(err => res.redirect(`/${url}`))
  });

//////////// RESULTS ROUTE /////////////////////////////
  router.get('/:poll/results', (req, res) => {
    const url = req.params.poll;
    API.getPoll(url)
      .then(result => {
        res.render('results', {'result': result, 'url': url})
      })
      .catch(err => res.render('result'))
  });



  return router;
}
