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
  __bhdsKvPromise?: Promise<KvClient | null>;
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

type KvClient = {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown): Promise<unknown>;
  del(key: string): Promise<unknown>;
  sadd(key: string, value: string): Promise<unknown>;
  srem(key: string, value: string): Promise<unknown>;
  smembers(key: string): Promise<string[]>;
};

async function loadKvClient(): Promise<KvClient | null> {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return null;
  }
  try {
    const mod = (await import(/* webpackIgnore: true */ "@vercel/kv").catch(
      () => null
    )) as { kv: KvClient } | null;
    return mod?.kv ?? null;
  } catch {
    return null;
  }
}

function vercelKvStore(kv: KvClient): CommentsStore {
  const key = (path: string) => `${KEY_PREFIX}${path}`;

  return {
    async list(path) {
      const comments = await kv.get<Comment[]>(key(path));
      return comments ?? [];
    },
    async save(path, comments) {
      if (comments.length === 0) {
        await kv.del(key(path));
        await kv.srem(PATH_INDEX_KEY, path);
      } else {
        await kv.set(key(path), comments);
        await kv.sadd(PATH_INDEX_KEY, path);
      }
    },
    async findById(id) {
      const paths = await kv.smembers(PATH_INDEX_KEY);
      for (const path of paths) {
        const comments = (await kv.get<Comment[]>(key(path))) ?? [];
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

  if (!g.__bhdsKvPromise) {
    g.__bhdsKvPromise = loadKvClient();
  }
  const kv = await g.__bhdsKvPromise;

  g.__bhdsCommentsStore = kv ? vercelKvStore(kv) : memoryStore();
  return g.__bhdsCommentsStore;
}
