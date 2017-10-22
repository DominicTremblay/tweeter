"use strict";

// Basic express setup:

const PORT              = 8080;
const express           = require("express");
const bodyParser        = require("body-parser");
const app               = express();
const { MongoClient }   = require("mongodb");
const MONGODB_URI       = "mongodb://localhost:27017/tweeter";
const sassMiddleware    = require('node-sass-middleware');
const path              = require('path');
const methodOverride      = require('method-override');

app.use(methodOverride('X-HTTP-Method-Override'));

app.use(sassMiddleware({
  /* Options */
  src: 'scss',
  dest: 'public/styles',
  debug: false,
  outputStyle: 'extended',
  prefix:  '/styles'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/> 
}));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
// app.use('/public', express.static(path.join(__dirname, 'public')));

// The in-memory database of tweets. It's a basic object with an array in it.
MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI}`);
    throw err;
  }
  console.log(`Connected to mongodb: ${MONGODB_URI}`);

  const DataHelpers = require("./lib/data-helpers.js")(db);

  // The `tweets-routes` module works similarly: we pass it the `DataHelpers` object
  // so it can define routes that use it to interact with the data layer.
  const tweetsRoutes = require("./routes/tweets")(DataHelpers);

  // Mount the tweets routes at the "/tweets" path prefix:
  app.use("/tweets", tweetsRoutes);

});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
