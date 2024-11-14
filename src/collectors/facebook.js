import { FacebookAdsApi, Page } from 'facebook-nodejs-business-sdk';
import { config } from '../config.js';
import { saveSocialPost } from '../database.js';
import { logger } from '../utils/logger.js';

FacebookAdsApi.init(config.facebook.accessToken);

export async function collectFacebookData() {
  try {
    const page = new Page(config.facebook.pageId);
    const posts = await page.getPosts({
      fields: ['id', 'message', 'created_time', 'from'],
      limit: 100,
    });

    let count = 0;
    for (const post of posts) {
      if (post.message) {
        await saveSocialPost({
          platform: 'facebook',
          post_id: post.id,
          content: post.message,
          author: post.from?.name,
          created_at: post.created_time
        });
        count++;
      }
    }

    logger.info(`Collected ${count} Facebook posts`);
    return count;
  } catch (error) {
    logger.error('Facebook data collection failed:', error);
    throw error;
  }
}