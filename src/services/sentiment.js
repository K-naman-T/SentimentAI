import Sentiment from 'sentiment';
import { saveSentimentResult } from '../database.js';
import { logger } from '../utils/logger.js';

const sentiment = new Sentiment();

export function analyzeSentiment(text) {
  try {
    const result = sentiment.analyze(text);
    const score = result.score;
    
    // Save to database
    saveSentimentResult(text, score);
    
    return {
      text,
      score,
      comparative: result.comparative,
      tokens: result.tokens,
      positive: result.positive,
      negative: result.negative
    };
  } catch (error) {
    logger.error('Sentiment analysis failed:', error);
    throw error;
  }
}