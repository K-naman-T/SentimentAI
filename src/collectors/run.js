import cron from 'node-cron';
import { collectTwitterData } from './twitter.js';
import { collectFacebookData } from './facebook.js';
import { collectInstagramData } from './instagram.js';
import { logger } from '../utils/logger.js';
import { setupDatabase } from '../database.js';

// Initialize database
setupDatabase();

// Function to run all collectors
async function runCollectors() {
  try {
    const [tweetCount, fbCount, igCount] = await Promise.all([
      collectTwitterData(),
      collectFacebookData(),
      collectInstagramData()
    ]);

    logger.info(`Collection complete. Collected:
      - Tweets: ${tweetCount}
      - Facebook posts: ${fbCount}
      - Instagram posts: ${igCount}
    `);
  } catch (error) {
    logger.error('Collection failed:', error);
  }
}

// Schedule collection every 15 minutes
cron.schedule('*/15 * * * *', runCollectors);

// Run immediately on start
runCollectors();