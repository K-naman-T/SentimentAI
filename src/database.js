import Database from 'better-sqlite3';
import { logger } from './utils/logger.js';

const db = new Database('sentiment.db');

export function setupDatabase() {
  try {
    // Social media posts table with enhanced media support
    db.exec(`
      CREATE TABLE IF NOT EXISTS social_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        platform TEXT NOT NULL,
        post_id TEXT NOT NULL,
        content TEXT,
        author TEXT,
        created_at DATETIME,
        collected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        processed INTEGER DEFAULT 0,
        has_media BOOLEAN DEFAULT FALSE,
        UNIQUE(platform, post_id)
      )
    `);

    // Media assets table for images and videos
    db.exec(`
      CREATE TABLE IF NOT EXISTS media_assets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER,
        url TEXT NOT NULL,
        type TEXT NOT NULL,
        width INTEGER,
        height INTEGER,
        size INTEGER,
        local_path TEXT,
        processed INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(post_id) REFERENCES social_posts(id),
        UNIQUE(post_id, url)
      )
    `);

    // Enhanced sentiment results table with multi-modal support
    db.exec(`
      CREATE TABLE IF NOT EXISTS sentiment_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER,
        text_content TEXT,
        image_content TEXT,
        text_score REAL,
        image_score REAL,
        combined_score REAL,
        confidence REAL,
        labels JSON,
        processed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(post_id) REFERENCES social_posts(id)
      )
    `);

    // Create indexes for better performance
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_posts_processed ON social_posts(processed);
      CREATE INDEX IF NOT EXISTS idx_media_processed ON media_assets(processed);
      CREATE INDEX IF NOT EXISTS idx_sentiment_post_id ON sentiment_results(post_id);
    `);

    logger.info('Database initialized successfully with multi-modal support');
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  }
}

export function saveSocialPost(post) {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO social_posts 
    (platform, post_id, content, author, created_at, has_media) 
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(
    post.platform,
    post.post_id,
    post.content,
    post.author,
    post.created_at,
    post.has_media || false
  );
  
  return result.lastInsertRowid;
}

export function saveMediaAsset(media) {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO media_assets 
    (post_id, url, type, width, height, size, local_path) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  return stmt.run(
    media.post_id,
    media.url,
    media.type,
    media.width,
    media.height,
    media.size,
    media.local_path
  );
}

export function saveSentimentResult(result) {
  const stmt = db.prepare(`
    INSERT INTO sentiment_results 
    (post_id, text_content, image_content, text_score, image_score, 
     combined_score, confidence, labels) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  return stmt.run(
    result.post_id,
    result.text_content,
    result.image_content,
    result.text_score,
    result.image_score,
    result.combined_score,
    result.confidence,
    JSON.stringify(result.labels)
  );
}

export function getUnprocessedPosts(limit = 100) {
  const stmt = db.prepare(`
    SELECT p.*, GROUP_CONCAT(m.url) as media_urls 
    FROM social_posts p 
    LEFT JOIN media_assets m ON p.id = m.post_id 
    WHERE p.processed = 0 
    GROUP BY p.id 
    ORDER BY p.collected_at ASC 
    LIMIT ?
  `);
  return stmt.all(limit);
}

export function getUnprocessedMedia(limit = 50) {
  const stmt = db.prepare(`
    SELECT m.*, p.platform 
    FROM media_assets m 
    JOIN social_posts p ON m.post_id = p.id 
    WHERE m.processed = 0 
    ORDER BY m.created_at ASC 
    LIMIT ?
  `);
  return stmt.all(limit);
}

export function markPostAsProcessed(id) {
  const stmt = db.prepare('UPDATE social_posts SET processed = 1 WHERE id = ?');
  return stmt.run(id);
}

export function markMediaAsProcessed(id) {
  const stmt = db.prepare('UPDATE media_assets SET processed = 1 WHERE id = ?');
  return stmt.run(id);
}

export function getRecentResults(limit = 100) {
  const stmt = db.prepare(`
    SELECT 
      r.*,
      p.platform,
      p.content as original_content,
      GROUP_CONCAT(m.url) as media_urls
    FROM sentiment_results r
    JOIN social_posts p ON r.post_id = p.id
    LEFT JOIN media_assets m ON p.id = m.post_id
    GROUP BY r.id
    ORDER BY r.processed_at DESC 
    LIMIT ?
  `);
  return stmt.all(limit);
}