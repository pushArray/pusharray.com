package twitter

import (
	"fmt"
	"github.com/dghubble/go-twitter/twitter"
	"github.com/dghubble/oauth1"
	"os"
	"strconv"
	"time"
)

const (
	twitterUserId = 111507370
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
	Entities     *twitter.Entities `json:"entities,omitempty"`
	Id           string            `json:"id,omitempty"`
	ProfileColor string            `json:"profile_color,omitempty"`
	Protected    bool              `json:"protected,omitempty"`
	ScreenName   string            `json:"screen_name,omitempty"`
	Text         string            `json:"text,omitempty"`
	Timestamp    string            `json:"timestamp,omitempty"`
	Url          string            `json:"url,omitempty"`
	UserImage    string            `json:"user_image,omitempty"`
	Username     string            `json:"username,omitempty"`
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

func (t *Twitter) GetTweets() ([]twitter.Tweet, int64, time.Duration) {
	tweets, r, _ := t.client.Timelines.UserTimeline(&t.params)

	t.Tweets = tweets

	limit, _ := strconv.ParseInt(r.Header.Get("X-Rate-Limit-Remaining"), 10, 64)
	reset, _ := strconv.ParseInt(r.Header.Get("X-Rate-Limit-Reset"), 10, 64)

	now := time.Now()
	diff := reset - now.Unix()

	return t.Tweets, limit, time.Duration(diff) * time.Second
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

func NewBasicTweet(tweet twitter.Tweet) BasicTweet {
	tw := tweet
	if tweet.Retweeted {
		tw = *tweet.RetweetedStatus
	}
	user := tw.User
	return BasicTweet{
		Entities:     tw.Entities,
		Id:           tw.IDStr,
		ProfileColor: fmt.Sprintf("#%s", user.ProfileLinkColor),
		Protected:    user.Protected,
		ScreenName:   user.ScreenName,
		Timestamp:    tw.CreatedAt,
		Text:         tw.Text,
		UserImage:    user.ProfileImageURLHttps,
		Username:     user.Name,
		Url:          fmt.Sprintf("https://twitter.com/%s/statuses/%s", user.ScreenName, tw.IDStr),
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
			Count:           3200,
			ExcludeReplies:  twitter.Bool(true),
			IncludeRetweets: twitter.Bool(true),
			UserID:          twitterUserId,
		},
	}
}
