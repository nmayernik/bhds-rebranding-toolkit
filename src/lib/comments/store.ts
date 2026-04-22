import Redis from "ioredis";

import type { Comment } from "./types";

export interface CommentsStore {
  list(path: string): Promise<Comment[]>;
  save(path: string, comments: Comment[]): Promise<void>;
  findById(id: string): Promise<{ path: string; comment: Comment } | null>;
}

const KEY_PREFIX = "comments:";
const PATH_INDEX_KEY = "comments:__paths__";

type CommentsGlobal = typeof globalThis & {
  __bhdsCommentsData?: Map<string, Comment[]>;
  __bhdsCommentsStore?: CommentsStore;
  __bhdsRedisClient?: Redis;
};

function getSharedMap(): Map<string, Comment[]> {
  const g = globalThis as CommentsGlobal;
  if (!g.__bhdsCommentsData) {
    g.__bhdsCommentsData = new Map<string, Comment[]>();
  }
  return g.__bhdsCommentsData;
}

function memoryStore(): CommentsStore {
  const store = getSharedMap();

  return {
    async list(path) {
      return store.get(path) ?? [];
    },
    async save(path, comments) {
      if (comments.length === 0) {
        store.delete(path);
      } else {
        store.set(path, comments);
      }
    },
    async findById(id) {
      for (const [path, comments] of store.entries()) {
        const comment = comments.find((c) => c.id === id);
        if (comment) return { path, comment };
      }
      return null;
    },
  };
}

function getRedisClient(): Redis | null {
  const url = process.env.REDIS_URL;
  if (!url) return null;

  const g = globalThis as CommentsGlobal;
  if (g.__bhdsRedisClient) return g.__bhdsRedisClient;

  const client = new Redis(url, {
    lazyConnect: false,
    maxRetriesPerRequest: 2,
    enableReadyCheck: true,
  });
  // Prevent an unhandled 'error' from crashing the Node process on transient
  // issues; individual awaits will still reject.
  client.on("error", () => {});

  g.__bhdsRedisClient = client;
  return client;
}

function redisStore(redis: Redis): CommentsStore {
  const key = (path: string) => `${KEY_PREFIX}${path}`;

  const readList = async (path: string): Promise<Comment[]> => {
    const raw = await redis.get(key(path));
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as Comment[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  return {
    list: readList,
    async save(path, comments) {
      if (comments.length === 0) {
        await redis.del(key(path));
        await redis.srem(PATH_INDEX_KEY, path);
      } else {
        await redis.set(key(path), JSON.stringify(comments));
        await redis.sadd(PATH_INDEX_KEY, path);
      }
    },
    async findById(id) {
      const paths = await redis.smembers(PATH_INDEX_KEY);
      for (const path of paths) {
        const comments = await readList(path);
        const comment = comments.find((c) => c.id === id);
        if (comment) return { path, comment };
      }
      return null;
    },
  };
}

export async function getStore(): Promise<CommentsStore> {
  const g = globalThis as CommentsGlobal;
  if (g.__bhdsCommentsStore) return g.__bhdsCommentsStore;

  const redis = getRedisClient();
  g.__bhdsCommentsStore = redis ? redisStore(redis) : memoryStore();
  return g.__bhdsCommentsStore;
}
