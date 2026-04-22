import { Redis } from "@upstash/redis";

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

function redisConfig(): { url: string; token: string } | null {
  // Accept either Upstash-native or legacy Vercel KV env var names so this
  // works with the Vercel Marketplace Redis integration and the deprecated
  // Vercel KV integration without extra wiring.
  const url =
    process.env.UPSTASH_REDIS_REST_URL ??
    process.env.KV_REST_API_URL ??
    null;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ??
    process.env.KV_REST_API_TOKEN ??
    null;
  if (!url || !token) return null;
  return { url, token };
}

function redisStore(redis: Redis): CommentsStore {
  const key = (path: string) => `${KEY_PREFIX}${path}`;

  return {
    async list(path) {
      const comments = await redis.get<Comment[]>(key(path));
      return comments ?? [];
    },
    async save(path, comments) {
      if (comments.length === 0) {
        await redis.del(key(path));
        await redis.srem(PATH_INDEX_KEY, path);
      } else {
        await redis.set(key(path), comments);
        await redis.sadd(PATH_INDEX_KEY, path);
      }
    },
    async findById(id) {
      const paths = await redis.smembers(PATH_INDEX_KEY);
      for (const path of paths) {
        const comments = (await redis.get<Comment[]>(key(path))) ?? [];
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

  const cfg = redisConfig();
  g.__bhdsCommentsStore = cfg
    ? redisStore(new Redis({ url: cfg.url, token: cfg.token }))
    : memoryStore();
  return g.__bhdsCommentsStore;
}
