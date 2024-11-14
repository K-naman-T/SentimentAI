import sharp from 'sharp';
import fetch from 'node-fetch';
import { promises as fs } from 'fs';
import path from 'path';
import sizeOf from 'image-size';
import { logger } from '../utils/logger.js';

const MEDIA_DIR = './media';

export async function setupMediaDirectory() {
  try {
    await fs.mkdir(MEDIA_DIR, { recursive: true });
  } catch (error) {
    logger.error('Failed to create media directory:', error);
    throw error;
  }
}

export async function downloadAndProcessImage(url, platform, postId) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

    const buffer = await response.buffer();
    const dimensions = sizeOf(buffer);
    
    // Generate unique filename
    const filename = `${platform}_${postId}_${Date.now()}.jpg`;
    const localPath = path.join(MEDIA_DIR, filename);

    // Process and save image
    await sharp(buffer)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toFile(localPath);

    return {
      local_path: localPath,
      width: dimensions.width,
      height: dimensions.height,
      size: buffer.length,
      type: 'image'
    };
  } catch (error) {
    logger.error('Image processing failed:', error);
    throw error;
  }
}

export async function getImageMetadata(localPath) {
  try {
    const metadata = await sharp(localPath).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: metadata.size
    };
  } catch (error) {
    logger.error('Failed to get image metadata:', error);
    throw error;
  }
}