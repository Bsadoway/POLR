"use strict";

const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const sms = require('../lib/sms');

module.exports = (API) => {
  
  router.use('/:poll/results', function yelp (req, res, next) {
    const url = req.params.poll;
    API.yelpCheck(url)
      .then(result => {
        if (result) {
          // console.log('result is')
          // console.log(result);
          // console.log('res locals result is')
          res.locals.yelp = result
          // console.log(res.locals.yelp);
          next()
        } else {
          res.locals.yelp = false
          next()
        }
      })
      .catch(err => console.log(err))
  }); 


  router.post('/sms', (req, res) => {
    const sms = req.body;
    API.incomingSMS(sms)
      .then(responseMsg => {
        const twiml = new MessagingResponse();
        twiml.message();
        res.writeHead(204, {'Content-type': 'text/xml'});
        res.end(twiml.toString());
      })
      .catch(err => console.log(err))
  });


  router.get("/", (req, res) => {
    API.getEverything()
      .then(result => {
        if(result.length !== 0){
          res.render('index');
        } else {
          res.status(404).render('404error');
        }
      })
      .catch(err => res.render('vote'))
  });

  router.post("/", (req, res) => {
    API.createPoll(req.body)
      .then(result => {
        res.redirect(`/${result.admin_url}`);
      })
      .catch(err => res.render('index'))
  });

/////////// ADMIN ROUTES /////////////////////////////////////

  router.get('/:poll/admin', (req, res) => {
    const admin_url = `${req.params.poll}/admin`;
    API.getPoll(admin_url)
      .then(result => {
        if(result.length !== 0){
          res.render('admin', {'result': result})
        } else {
          res.status(404).render('404error');
        }
      })
      .catch(err => res.render('vote'))
  });

  // Inviting friends
  router.post('/:poll/admin', (req, res) => {
    const admin_url = `${req.params.poll}/admin`;
    const friends = [].concat(req.body.friends);
    API.inviteFriends(admin_url, friends)
      .then(() => {
        res.redirect(`/${admin_url}`)
      })
      .catch(err => res.redirect(`/${admin_url}`))
  });

  // Closes poll
  router.put('/:poll/admin', (req, res) => {
    const url = `${req.params.poll}/admin`;
    API.closePoll(url)
      .then(result => {
        res.render('index', { 'result': result })
      })
      .catch(err => res.render('vote'))
  });

/////////// VOTER ROUTES /////////////////////////////////////

  router.get('/:poll', (req, res) => {
    const url = req.params.poll;
    API.getPoll(url)
      .then(result => {
        if(result.length !== 0){
          if (result[0].is_open) {
          res.render('vote', {'result': result, 'url': url})
          } else {
          res.redirect(`/${url}/results`)
          }
        } else {
          res.status(404).render('404error');
        }
      })
      .catch(err => res.render('vote'))
  });

  router.post('/:poll', (req, res) => {
    const url = req.params.poll;
    API.submitVote(url, req.body)
      .then(result => res.redirect(`/${url}/results`))
      .catch(err => res.redirect(`/${url}/results`))
  });


//////////// RESULTS ROUTE /////////////////////////////
  router.get('/:poll/results', (req, res) => {
    const url = req.params.poll;
    API.getPoll(url)
      .then(result => {
        if(result.length !== 0){
          res.render('results', {'result': result, 'url': url})
        } else {
          res.status(404).render('404error');
        }
      })
      .catch(err => res.render('result'))
  });

  router.post('/:poll/results', (req, res) => {
    console.log(req.body);
    const fastForward = req.body.fastForward
    const url = req.params.poll;
    API.irv(url, fastForward)
      .then(result => res.redirect(`/${url}/results`))
      .catch(err => res.redirect(`/${url}`))
  });

  router.put('/:poll/results', (req, res) => {
    const url = req.params.poll;
    API.resetIRV(url)
      .then(result => res.end())
      .catch(err => res.end())
  });

  router.get('*', function (req, res) {
    res.status(404).render('404error');
  });


  return router;
}
