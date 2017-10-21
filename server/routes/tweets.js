"use strict";

const userHelper    = require("../lib/util/user-helper")

const express       = require('express');
const tweetsRoutes  = express.Router();

module.exports = function(DataHelpers) {

  tweetsRoutes.get("/", function(req, res) {
    
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json(tweets);
      }
    });
  });
  
  tweetsRoutes.post("/", function(req, res) {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    const user = req.body.user ? req.body.user : userHelper.generateRandomUser();
    const tweet = {
      user: user,
      content: {
        text: req.body.text
      },
      created_at: Date.now()
    };

    DataHelpers.saveTweet(tweet, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send(tweet);
      }
    });
  });

  tweetsRoutes.post("/:id", (req, res) => {
    
    const tweetUpdate = {
      id: req.params.id,
      likes: Number(req.body.likes)
    };

    ( tweetUpdate.likes === 0 ) ? tweetUpdate.likes = 1 : tweetUpdate.likes = 0;

    DataHelpers.updateTweet(tweetUpdate, (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json(tweetUpdate.likes);
      }

    });

  
  });

  return tweetsRoutes;

}
