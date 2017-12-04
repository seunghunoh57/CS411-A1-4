const express = require('express');
const router = express.Router();
const config = require('../config/config');
const passport = require('passport');
var User = require('../models/Users');

const jwt = require('jsonwebtoken');
const Twit = require('twit');
const indico = require('indico.io');

const T = new Twit(config.oauth)
indico.apiKey = config.indico.apiKey

require('../config/passport')(passport); // pass passport for configuration


/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

router.get('/me', passport.authenticate('jwt', {session:false}),(req, res) => {
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    res.status(200).send(decoded);
  });
});

router.get('/search', passport.authenticate('jwt', {session:false}),(req, res) => {
  T.get('users/lookup', { screen_name: req.query.searchBar })
  .then(function(result) {
      res.json(result.data);
  })
  .catch(function (err){
    console.log("FOUND ERROR: " + err.message)
  })
})

router.get('/tweets', passport.authenticate('jwt', {session:false}),(req,res) => {
  T.get('/statuses/user_timeline', {screen_name: req.query.screen_name, count: 50, tweet_mode: 'extended'})
  .then(function(result){
    res.json(result.data)
  })
  .catch(function (err){
    console.log("FOUND ERROR: " + err.message)
  })
})

router.get('/sentiment', passport.authenticate('jwt', {session:false}),(req,res) => {
  indico.emotion(req.query.tweet,{top_n: 1})
  .then(function(result){
    res.json(result);
  })
  .catch(function(err){
    console.log(err.message);
  });
})

router.get('error', (req,res) => {
  res.send('error');
})


module.exports = router;
