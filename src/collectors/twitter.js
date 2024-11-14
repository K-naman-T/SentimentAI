import { TwitterApi } from 'twitter-api-v2';
import { config } from '../config.js';
import { saveSocialPost } from '../database.js';
import { logger } from '../utils/logger.js';

const twitterClient = new TwitterApi(config.twitter.bearerToken);

export async function collectTwitterData() {
  try {
    const keywords = config.searchKeywords.join(' OR ');
    const tweets = await twitterClient.v2.search({
      query: keywords,
      'tweet.fields': ['created_at', 'author_id', 'text'],
      max_results: 100,
    });

    for (const tweet of tweets.data) {
      await saveSocialPost({
        platform: 'twitter',
        post_id: tweet.id,
        content: tweet.text,
        author: tweet.author_id,
        created_at: tweet.created_at
      });
    }

    logger.info(`Collected ${tweets.data.length} tweets`);
    return tweets.data.length;
  } catch (error) {
    logger.error('Twitter data collection failed:', error);
    throw error;
  }
}