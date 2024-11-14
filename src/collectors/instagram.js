import { IgApiClient } from 'instagram-private-api';
import { config } from '../config.js';
import { saveSocialPost } from '../database.js';
import { logger } from '../utils/logger.js';

const ig = new IgApiClient();

async function initializeInstagram() {
  ig.state.generateDevice(config.instagram.username);
  await ig.account.login(config.instagram.username, config.instagram.password);
}

export async function collectInstagramData() {
  try {
    await initializeInstagram();
    
    const hashtags = config.searchKeywords.map(keyword => keyword.replace(/\s+/g, ''));
    let count = 0;

    for (const hashtag of hashtags) {
      const posts = await ig.feed.tag(hashtag).items();
      
      for (const post of posts.slice(0, 33)) { // Limit to ~33 posts per hashtag
        if (post.caption?.text) {
          await saveSocialPost({
            platform: 'instagram',
            post_id: post.id,
            content: post.caption.text,
            author: post.user.username,
            created_at: new Date(post.taken_at * 1000).toISOString()
          });
          count++;
        }
      }
    }

    logger.info(`Collected ${count} Instagram posts`);
    return count;
  } catch (error) {
    logger.error('Instagram data collection failed:', error);
    throw error;
  }
}