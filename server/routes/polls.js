"use strict";

const express = require('express');
const router  = express.Router();
const bodyParser  = require("body-parser");


module.exports = (API) => {

  router.get("/", (req, res) => {
      API.getEverything()
      .then(res => res.render('index'))
      .catch(err => res.render('index'))
  });

  router.post("/", (req, res) => {
      API.createPoll(req.body)
      .then(res => res.render('index'))
      .catch(err => res.render('index'))
  });


  router.get('/:poll/admin', (req, res) => {
    console.log("GET to admin poll route");
  });

  router.post('/:poll/admin', (req, res) => {
    console.log("POST to admin route");
  });

  router.put('/:poll/admin', (req, res) => {
    console.log("PUT to admin route");
  });

// Voter routes

  router.get('/:poll', (req, res) => {
    const url = req.params.poll;
    console.log(url);
    API.getPoll(url)
      .then(res => {

        console.log(res);
        res.render('vote')


      })
      .catch(err => res.render('vote'))

  });

  router.post('/:poll', (req, res) => {
    console.log("POST to poll route");
  });


  return router;
}
