package twitter

import (
	"github.com/logashoff/anaconda"
	"net/url"
	"os"
	"strconv"
	"time"
)

const (
	POLL_INTERVAL   = 5 * time.Minute
	TWITTER_USER_ID = 111507370
	TWEET_COUNT     = 50
)

var (
	twitterConsumerKey       = os.Getenv("TWITTER_CONSUMER_KEY")
	twitterConsumerSecret    = os.Getenv("TWITTER_CONSUMER_SECRET")
	twitterAccessTokenSecret = os.Getenv("TWITTER_ACCESS_TOKEN_SECRET")
	twitterAccessTokenKey    = os.Getenv("TWITTER_ACCESS_TOKEN_KEY")
	api                      = anaconda.NewTwitterApi(twitterAccessTokenKey, twitterAccessTokenSecret)
	values                   = &url.Values{}
)

type BasicTweet struct {
	Id           string            `json:"id"`
	Username     string            `json:"username"`
	Url          string            `json:"url"`
	Timestamp    string            `json:"timestamp"`
	ScreenName   string            `json:"screen_name"`
	Text         string            `json:"text"`
	UserImage    string            `json:"user_image"`
	ProfileColor string            `json:"profile_color"`
	Entities     anaconda.Entities `json:"entities"`
	Protected    bool              `json:"protected"`
}

type Twitter struct {
	Tweets []anaconda.Tweet
}

func (t *Twitter) GetTweetId(tweet anaconda.Tweet) (id string) {
	if tweet.Retweeted {
		if len(tweet.RetweetedStatus.IdStr) > 0 {
			id = tweet.RetweetedStatus.IdStr
		} else {
			id = tweet.IdStr
		}
	} else {
		id = tweet.IdStr
	}
	return id
}

func (t *Twitter) GetTweets() {
	t.Tweets, _ = api.GetUserTimeline(*values)
}

func (t *Twitter) GetMaxId(maxId string, limit int) (tweets []anaconda.Tweet) {
	if len(maxId) > 0 {
		length := len(t.Tweets)
		for i := range t.Tweets {
			tweet := t.Tweets[i]
			id := t.GetTweetId(tweet)
			if id == maxId {
				if length-i+1 < limit {
					limit = length - i - 1
				}
				min := i + 1
				max := min + limit
				tweets = t.Tweets[min:max]
				break
			}
		}
	}
	return tweets
}

func PollTweets(t *Twitter) {
	c := time.Tick(POLL_INTERVAL)
	for range c {
		t.GetTweets()
	}
}

func NewBasicTweet(tweet anaconda.Tweet) BasicTweet {
	at := tweet
	if tweet.Retweeted {
		at = *tweet.RetweetedStatus
	}
	user := at.User
	return BasicTweet{
		Id:           at.IdStr,
		Username:     user.Name,
		Url:          "https://twitter.com/" + user.ScreenName + "/statuses/" + at.IdStr,
		Timestamp:    at.CreatedAt,
		ScreenName:   user.ScreenName,
		Text:         at.Text,
		UserImage:    user.ProfileImageUrlHttps,
		ProfileColor: "#" + user.ProfileLinkColor,
		Entities:     at.Entities,
		Protected:    user.Protected,
	}
}

func ToBasicTweets(tweets []anaconda.Tweet) (basicTweets []BasicTweet) {
	for i := range tweets {
		basicTweets = append(basicTweets, NewBasicTweet(tweets[i]))
	}
	return basicTweets
}

func NewTwitter() Twitter {
	anaconda.SetConsumerKey(twitterConsumerKey)
	anaconda.SetConsumerSecret(twitterConsumerSecret)
	values.Set("user_id", strconv.FormatInt(TWITTER_USER_ID, 10))
	values.Set("count", strconv.FormatInt(TWEET_COUNT, 10))
	values.Set("exclude_replies", "true")
	values.Set("include_rts", "true")
	return Twitter{}
}
