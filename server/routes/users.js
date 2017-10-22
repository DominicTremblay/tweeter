"use strict";

const userHelper    = require("../lib/util/user-helper")

const express       = require('express');
const usersRoutes  = express.Router();

module.exports = function(DataHelpers) {
  
  usersRoutes.post("/", function(req, res) {

    console.log('Receiving user');
    console.log(req.body.username, req.body.email, req.body.password);

    res.status(201).end("User Created!");

    // if (!req.body.text) {
    //   res.status(400).json({ error: 'invalid request: no data in POST body'});
    //   return;
    // }

  });

  return usersRoutes;

}
