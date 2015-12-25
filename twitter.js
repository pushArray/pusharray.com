require('colors');
const Twitter = require('twitter');
const https = require('https');
const fs = require('fs');

/**
 * @typedef {{
 *   message: string,
 *   code: number
 * }} TwitterError
 */

/**
 * Twitter user id used to retrieve tweets.
 * @private {number}
 */
const userId = 111507370;

/**
 * Milliseconds per minute.
 * @private {number}
 */
const msPerMinute = 60 * 1000;

/**
 * Milliseconds per day.
 * @private {number}
 */
const msPerDay = 24 * 60 * msPerMinute;

/**
 * Images directory.
 * @private {string}
 */
const imageDir = './static/images/twitter/';

/**
 * Minimum number of tweets per request.
 * @private {number}
 */
const minCount = 300; // TODO: Get rate limit and count from Twitter API.

/**
 * Number of pending file write streams.
 * @private {number}
 */
var pendingFileStreams = 0;

/**
 * Indicates active Twitter connection.
 * @private {boolean}
 */
var pendingData = false;

/**
 * Tweets data.
 * @private {Array<Object>}
 */
var tweetData = [];

/**
 * Twitter request parameters.
 * @private {Object}
 */
var restParams = {
  user_id: userId,
  exclude_replies: true,
  include_rts: true,
  count: minCount
};

/**
 * OS Environment variables.
 * @private {Object<string, string>}
 */
var env = process.env;

/**
 * Twitter client.
 * @private {Twitter}
 */
const client = new Twitter({
  consumer_key: env.TWITTER_CONSUMER_KEY,
  consumer_secret: env.TWITTER_CONSUMER_SECRET,
  access_token_key: env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: env.TWITTER_ACCESS_TOKEN_SECRET
});

/**
 * Checks if current data contains tweet with specified id.
 * @param {string} tweetId Tweet id.
 * @returns {boolean} True if current data contains tweet with specified id.
 * @private
 */
function hasTweetId(tweetId) {
  if (!tweetId) {
    return false;
  }
  for (var i = tweetData.length; i-- > 0;) {
    if (tweetData[i].id === tweetId) {
      return true;
    }
  }
  return false;
}

/**
 * Downloads images from specified URL and saves them to {@link imageDir}.
 * @param {string} imageUrl Image URL.
 * @param {string} username Twitter username.
 * @private
 */
function getUserImage(imageUrl, username) {
  if (imageUrl && username) {
    pendingFileStreams++;
    fs.stat(imageDir + username + '.jpg', function (err, stat) {
      var fileExists = (!err || err.code !== 'ENOENT');
      var now = new Date().getTime();
      var mtime = stat ? stat.mtime.getTime() : 0;
      if (!fileExists || mtime < now - msPerDay * 5) {
        var f = fs.createWriteStream(imageDir + username + '.jpg');
        https.get(imageUrl, function (res) {
          res.pipe(f);
          pendingFileStreams--;
        });
      } else {
        pendingFileStreams--;
      }
    });
  }
}

/**
 * Checks if tweet data is valid and performs additional processing like
 * downloading user images.
 * @param {Object} tweet Tweet data object.
 * @returns {boolean} True if tweet data is valid.
 * @private
 */
function handleTweet(tweet) {
  if (!tweet || !tweet.text || hasTweetId(tweet.id)) {
    return false;
  }
  var retweetStatus = tweet.retweeted_status;
  var username = '';
  var imageUrl = '';
  if (retweetStatus) {
    imageUrl = retweetStatus.user.profile_image_url_https;
    username = retweetStatus.user.screen_name;
  } else if (tweet.user) {
    imageUrl = tweet.user.profile_image_url_https;
    username = tweet.user.screen_name;
  }
  getUserImage(imageUrl, username);
  return true;
}

/**
 * Delay data request.
 * @param {number=} delay Delay in milliseconds. Default is 30 min.
 * @private
 */
function delayRequest(delay) {
  delay = delay || 30 * msPerMinute;
  setTimeout(getUserTimeline, delay);
}

/**
 * Logs Twitter API errors to console.
 * @param {Array<TwitterError>|TwitterError} errors
 */
function logErrors(errors) {
  if (Array.isArray(errors)) {
    var i = 0;
    var l = errors.length;
    for (; i < l; i++) {
      var error = errors[i];
      logError(error);
    }
  } else {
    logError(errors);
  }
}

/**
 * Logs Twitter API error to console.
 * @param {TwitterError} error
 */
function logError(error) {
  if (error && error.message) {
    console.warn(error.message.red);
  }
}

/**
 * Downloads user timeline based on parameters from {@link restParams}.
 * @private
 */
function getUserTimeline() {
  if (pendingData) {
    return;
  }
  pendingData = true;
  client.get('statuses/user_timeline', restParams, function(error, data) {
    pendingData = false;
    if (!error) {
      var dataLength = data.length;
      if (dataLength < minCount && restParams.lastCount !== dataLength) {
        restParams.count += minCount - data.length;
        // FIXME: This will prevent from loading min number of tweets in cases where there
        //        are too many replies with exclude_replies set to true.
        restParams.lastCount = dataLength;
        getUserTimeline();
      } else {
        tweetData = [];
        for (var i = 0; i < data.length; i++) {
          var datum = data[i];
          if (handleTweet(datum)) {
            tweetData.push(datum);
          }
        }
        delayRequest();
      }
    } else {
      // TODO: Get tweets from cache if rate limit exceeded.
      logErrors(error);
      delayRequest();
    }
  });
}

/**
 * Public method for {@link getUserTimeline}.
 */
module.exports.getUserTimeline = getUserTimeline;

/**
 * Returns downloaded tweet data.
 * @returns {Array}
 */
module.exports.getTweetData = function() {
  return tweetData.concat();
};
