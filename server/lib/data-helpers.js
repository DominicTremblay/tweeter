"use strict";

const { ObjectID } = require('mongodb');

// Simulates the kind of delay we see with network or filesystem operations
const simulateDelay = require("./util/simulate-delay");

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {

      db.collection("tweets").insert( newTweet, (err, res) => {

        if(err) {
          return callback(err);
        }
    
        callback(null, true);
      });
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {

      db.collection("tweets").find().toArray(callback);
    },

    updateTweet: function(tweetUpdate, callback) {


      db.collection('tweets').update({_id: ObjectID(tweetUpdate.id)}, {$set: {likes: tweetUpdate.likes}}, callback);
    }

  };
}
