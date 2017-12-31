"use strict";
require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.NODE_ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();
const knexConfig  = require("../knexfile");
global.knex       = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

const api = require('./lib/api');

// Twilio
const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const twilio = require('twilio')(accountSid, authToken);

const pollRoutes = require("./routes/polls");

app.use(morgan('dev'));
app.use(knexLogger(global.knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/../styles",
  dest: __dirname + "/../public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

app.use(pollRoutes(api));

app.listen(PORT, () => {
    console.log("POLR listening on port " + PORT);
});

