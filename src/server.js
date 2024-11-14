import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { setupDatabase, getRecentResults, getUnprocessedPosts } from './database.js';
import { analyzeSentiment } from './services/sentiment.js';
import { logger } from './utils/logger.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Initialize database
setupDatabase();

// Routes
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await getUnprocessedPosts(100);
    res.json(posts);
  } catch (error) {
    logger.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { text } = req.body;
    const sentiment = analyzeSentiment(text);
    res.json(sentiment);
  } catch (error) {
    logger.error('Error analyzing sentiment:', error);
    res.status(500).json({ error: 'Failed to analyze sentiment' });
  }
});

app.get('/api/results', async (req, res) => {
  try {
    const results = await getRecentResults(100);
    res.json(results);
  } catch (error) {
    logger.error('Error fetching results:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});