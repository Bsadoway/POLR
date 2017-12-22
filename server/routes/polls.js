"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (API) => {

  router.get("/", (req, res) => {
      API.getEverything()
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

  router.delete('/:poll/admin', (req, res) => {
    console.log("DELETE to admin route");
  });

// Voter routes

  router.get('/:poll', (req, res) => {
    console.log("GET to poll route");
  });

  router.post('/:poll', (req, res) => {
    console.log("POST to poll route");
  });


  return router;
}
