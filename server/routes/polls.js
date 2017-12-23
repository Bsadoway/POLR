"use strict";

const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");

module.exports = (API) => {

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
    API.inviteFriends(url, friends)
      .then(result => {
        console.log(result);
        res.render('admin', { 'result': result })
      })
      .catch(err => res.render('vote'))
  });

  // Changes poll status 
  router.put('/:poll/admin', (req, res) => {
    const url = `${req.params.poll}/admin`;
    API.inviteFriends(url)
      .then(result => {
        console.log(result);
        res.render('admin', { 'result': result })
      })
      .catch(err => res.render('vote'))
  });

/////////// VOTER ROUTES /////////////////////////////////////


  router.get('/:poll', (req, res) => {
    const url = req.params.poll;
    console.log(url);
    API.getPoll(url)
      .then(result => res.render('admin', {'vars': 'var1'}))
      .catch(err => res.render('vote'))
  });

  router.post('/:poll', (req, res) => {
    console.log("POST to poll route");
  });
  
  return router;
}
