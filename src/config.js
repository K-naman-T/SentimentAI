import dotenv from 'dotenv';
dotenv.config();

export const config = {
  twitter: {
    bearerToken: process.env.TWITTER_BEARER_TOKEN,
    apiKey: process.env.TWITTER_API_KEY,
    apiSecret: process.env.TWITTER_API_SECRET,
  },
  facebook: {
    appId: process.env.FACEBOOK_APP_ID,
    appSecret: process.env.FACEBOOK_APP_SECRET,
    accessToken: process.env.FACEBOOK_ACCESS_TOKEN,
    pageId: process.env.FACEBOOK_PAGE_ID,
  },
  instagram: {
    username: process.env.INSTAGRAM_USERNAME,
    password: process.env.INSTAGRAM_PASSWORD,
  },
  searchKeywords: process.env.SEARCH_KEYWORDS.split(','),
};