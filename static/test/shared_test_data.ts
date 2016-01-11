import {BasicTweet} from './exports';

export default {
  getBasicTweet(): BasicTweet {
    return {
      'id': '663161444813279232',
      'username': 'Alex Logashov',
      'url': 'https://twitter.com/logashoff/statuses/663161444813279232',
      'timestamp': 'Sun Nov 08 01:09:44 +0000 2015',
      'screen_name': 'logashoff',
      'text': 'JavaScript in one picture: https://t.co/QbRwpZTh83',
      'user_image': '',
      'profile_color': '#1F98C7',
      'entities': {
        'hashtags': [],
        'symbols': [],
        'user_mentions': [],
        'urls': [
          {
            'url': 'https://t.co/QbRwpZTh83',
            'expanded_url': 'https://github.com/coodict/javascript-in-one-pic',
            'display_url': 'github.com/coodict/javasc…',
            'indices': [27, 50]
          }
        ]
      }
    };
  }
}
