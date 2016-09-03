package twitter

import (
	"github.com/dghubble/go-twitter/twitter"
	"github.com/dghubble/oauth1"
	"os"
	"time"
)

const (
	pollInterval  = 5 * time.Minute
	twitterUserId = 111507370
	tweetCount    = 50
)

var (
	accessTokenKey    = os.Getenv("TWITTER_ACCESS_TOKEN_KEY")
	accessTokenSecret = os.Getenv("TWITTER_ACCESS_TOKEN_SECRET")
	consumerKey       = os.Getenv("TWITTER_CONSUMER_KEY")
	consumerSecret    = os.Getenv("TWITTER_CONSUMER_SECRET")
	config            = oauth1.NewConfig(consumerKey, consumerSecret)
	token             = oauth1.NewToken(accessTokenKey, accessTokenSecret)
	httpClient        = config.Client(oauth1.NoContext, token)
)

type BasicTweet struct {
	Entities     *twitter.Entities `json:"entities"`
	Id           string            `json:"id"`
	ProfileColor string            `json:"profile_color"`
	Protected    bool              `json:"protected"`
	ScreenName   string            `json:"screen_name"`
	Text         string            `json:"text"`
	Timestamp    string            `json:"timestamp"`
	Url          string            `json:"url"`
	UserImage    string            `json:"user_image"`
	Username     string            `json:"username"`
}

type Twitter struct {
	Tweets []twitter.Tweet
	client *twitter.Client
	params twitter.UserTimelineParams
}

func (t *Twitter) GetTweetId(tweet twitter.Tweet) (id string) {
	if tweet.Retweeted {
		if len(tweet.RetweetedStatus.IDStr) > 0 {
			id = tweet.RetweetedStatus.IDStr
		} else {
			id = tweet.IDStr
		}
	} else {
		id = tweet.IDStr
	}
	return id
}

func (t *Twitter) GetTweets() {
	t.Tweets, _, _ = t.client.Timelines.UserTimeline(&t.params)
}

func (t *Twitter) GetMaxId(maxId string, limit int) (tweets []twitter.Tweet) {
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
	c := time.Tick(pollInterval)
	for range c {
		t.GetTweets()
	}
}

func NewBasicTweet(tweet twitter.Tweet) BasicTweet {
	tw := tweet
	if tweet.Retweeted {
		tw = *tweet.RetweetedStatus
	}
	user := tw.User
	return BasicTweet{
		Entities:     tw.Entities,
		Id:           tw.IDStr,
		ProfileColor: "#" + user.ProfileLinkColor,
		Protected:    user.Protected,
		ScreenName:   user.ScreenName,
		Timestamp:    tw.CreatedAt,
		Text:         tw.Text,
		UserImage:    user.ProfileImageURLHttps,
		Username:     user.Name,
		Url:          "https://twitter.com/" + user.ScreenName + "/statuses/" + tw.IDStr,
	}
}

func ToBasicTweets(tweets []twitter.Tweet) (basicTweets []BasicTweet) {
	for i := range tweets {
		basicTweets = append(basicTweets, NewBasicTweet(tweets[i]))
	}
	return basicTweets
}

func NewTwitter() Twitter {
	return Twitter{
		client: twitter.NewClient(httpClient),
		params: twitter.UserTimelineParams{
			Count:           tweetCount,
			ExcludeReplies:  twitter.Bool(true),
			IncludeRetweets: twitter.Bool(true),
			UserID:          twitterUserId,
		},
	}
}
