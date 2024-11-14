# Social Media Sentiment Analyzer

A real-time social media sentiment analysis system that collects and analyzes posts from Twitter, Facebook, and Instagram.

## Features

- Multi-platform social media data collection
  - Twitter (X) posts
  - Facebook page posts
  - Instagram hashtag posts
- Automated sentiment analysis
- Real-time data collection (15-minute intervals)
- Interactive web dashboard
- SQLite database storage
- Comprehensive logging system

## Prerequisites

- Node.js 16.x or higher
- API credentials for:
  - Twitter API v2
  - Facebook Graph API
  - Instagram Private API
- SQLite3

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd social-sentiment-analyzer
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your API credentials:
```env
# Twitter API Credentials
TWITTER_BEARER_TOKEN=your_bearer_token
TWITTER_API_KEY=your_api_key
TWITTER_API_SECRET=your_api_secret

# Facebook API Credentials
FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_app_secret
FACEBOOK_ACCESS_TOKEN=your_access_token
FACEBOOK_PAGE_ID=your_page_id

# Instagram Credentials
INSTAGRAM_USERNAME=your_username
INSTAGRAM_PASSWORD=your_password

# Search Configuration
SEARCH_KEYWORDS=keyword1,keyword2,keyword3
```

## Usage

1. Start the server:
```bash
npm run dev
```

2. Run data collectors:
```bash
npm run collect
```

3. Access the dashboard:
```
http://localhost:3000
```

## Project Structure

```
├── src/
│   ├── collectors/           # Social media data collectors
│   │   ├── twitter.js
│   │   ├── facebook.js
│   │   ├── instagram.js
│   │   └── run.js
│   ├── services/            # Business logic
│   │   └── sentiment.js
│   ├── utils/              # Utility functions
│   │   └── logger.js
│   ├── config.js           # Configuration
│   ├── database.js         # Database operations
│   └── server.js           # Express server
├── public/                 # Frontend assets
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── package.json
└── .env
```

## API Endpoints

- `GET /api/posts` - Get unprocessed social media posts
- `POST /api/analyze` - Analyze text sentiment
- `GET /api/results` - Get recent sentiment analysis results

## Database Schema

### Social Posts Table
```sql
CREATE TABLE social_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  platform TEXT NOT NULL,
  post_id TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT,
  created_at DATETIME,
  collected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  processed INTEGER DEFAULT 0,
  UNIQUE(platform, post_id)
)
```

### Sentiment Results Table
```sql
CREATE TABLE sentiment_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL,
  score REAL NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.