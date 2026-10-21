import { Redis } from 'ioredis';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

class InMemoryCache {
  private cache = new Map<string, { value: string; expiresAt: number }>();

  async get(key: string): Promise<string | null> {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key: string, value: string, mode?: string, ttlSeconds?: number): Promise<'OK'> {
    const ttl = (mode === 'EX' && ttlSeconds) ? ttlSeconds * 1000 : 3600 * 1000;
    this.cache.set(key, { value, expiresAt: Date.now() + ttl });
    return 'OK';
  }

  async del(key: string): Promise<number> {
    const existed = this.cache.delete(key);
    return existed ? 1 : 0;
  }

  async flushall(): Promise<'OK'> {
    this.cache.clear();
    return 'OK';
  }
}

let redisClient: Redis | null = null;
const memoryCache = new InMemoryCache();
let useMemoryFallback = false;

try {
  redisClient = new Redis(env.REDIS_URL, {
    retryStrategy: (times) => {
      if (times > 3) {
        logger.warn('Redis connection failed 3 times. Falling back to in-memory caching.');
        useMemoryFallback = true;
        return null; // Stop retrying
      }
      return Math.min(times * 100, 2000);
    },
    connectTimeout: 3000,
    lazyConnect: true,
  });

  redisClient.on('connect', () => {
    logger.info('Connected to Redis server successfully.');
    useMemoryFallback = false;
  });

  redisClient.on('error', (err) => {
    logger.warn('Redis error encountered; using in-memory fallback cache.', err.message);
    useMemoryFallback = true;
  });

  // Attempt initial connect asynchronously
  redisClient.connect().catch((err) => {
    logger.warn('Initial Redis connection unsuccessful; continuing with in-memory fallback cache.', err.message);
    useMemoryFallback = true;
  });
} catch (err: any) {
  logger.warn('Redis client initialization error; continuing with in-memory cache.', err.message);
  useMemoryFallback = true;
}

export const cache = {
  get: async (key: string): Promise<string | null> => {
    if (useMemoryFallback || !redisClient || redisClient.status !== 'ready') {
      return memoryCache.get(key);
    }
    try {
      return await redisClient.get(key);
    } catch {
      return memoryCache.get(key);
    }
  },

  set: async (key: string, value: string, ttlSeconds: number = 300): Promise<void> => {
    if (useMemoryFallback || !redisClient || redisClient.status !== 'ready') {
      await memoryCache.set(key, value, 'EX', ttlSeconds);
      return;
    }
    try {
      await redisClient.set(key, value, 'EX', ttlSeconds);
    } catch {
      await memoryCache.set(key, value, 'EX', ttlSeconds);
    }
  },

  del: async (key: string): Promise<void> => {
    if (useMemoryFallback || !redisClient || redisClient.status !== 'ready') {
      await memoryCache.del(key);
      return;
    }
    try {
      await redisClient.del(key);
    } catch {
      await memoryCache.del(key);
    }
  },

  flush: async (): Promise<void> => {
    if (useMemoryFallback || !redisClient || redisClient.status !== 'ready') {
      await memoryCache.flushall();
      return;
    }
    try {
      await redisClient.flushall();
    } catch {
      await memoryCache.flushall();
    }
  },
};
