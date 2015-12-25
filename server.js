require('colors');
const express = require('express');
const Twitter = require('./twitter');

/**
 * Port number.
 * @private {number}
 */
const port = 8080;

/**
 * Page title.
 * @private {string}
 */
const pageTitle = 'shiftArray(com)';

/**
 * Initialize Twitter polling.
 */
Twitter.getUserTimeline();

/**
 * Transforms Twitter REST response object into a simple data structure.
 * @param {Array} data - Twitter data.
 * @returns {Array}
 */
function processData(data) {
  return data.map(function(value) {
    value = value.retweeted ? value.retweeted_status : value;
    var user = value.user;
    return {
      id: value.id_str,
      username: user.name,
      url: 'https://twitter.com/' + user.screen_name + '/statuses/' + value.id_str,
      timestamp: value.created_at,
      screenName: user.screen_name,
      text: value.text,
      userImage: '/images/twitter/' + user.screen_name + '.jpg',
      profileColor: '#' + user.profile_link_color,
      entities: value.entities
    }
  });
}

/**
 * Express application.
 * @private {Express}
 */
const app = express();
app.use(express.static(__dirname + '/static'));
app.use(function(req, res, next) {
  res.set('X-Frame-Options', 'SAMEORIGIN');
  next();
});
app.set('views', 'templates');
app.set('view engine', 'jade');
app.get('/tweets/:maxId?/:count?', function(req, res) {
  var maxId = req.params.maxId;
  var count = +req.params.count || 10;
  var tweets = Twitter.getTweetData();
  var data = [];
  if (maxId) {
    var i = 0;
    var l = tweets.length;
    for (; i < l; i++) {
      var tweet = tweets[i];
      var id = tweet.retweeted && tweet.retweeted_status.id_str || tweet.id_str;
      if (id === maxId) {
        data = tweets.slice(i + 1, i + count + 1);
        break;
      }
    }
  } else {
    data = tweets.slice(0, count);
  }
  res.send(processData(data));
});
app.get('/:search?', function(req, res) {
  res.render('index', {
    pageTitle: pageTitle
  });
});
app.use(function(req, res) {
  res.redirect('/');
});

app.listen(port);
console.log('Server running...'.green);
