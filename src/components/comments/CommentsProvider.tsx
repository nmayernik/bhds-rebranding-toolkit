"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";

import type {
  Anchor,
  Comment,
  Coords,
  CreateCommentInput,
  CreateReplyInput,
} from "@/lib/comments/types";

const AUTHOR_STORAGE_KEY = "bhds.commentAuthor";

type Draft = {
  coords: Coords;
  clientX: number;
  clientY: number;
  anchor: Anchor | null;
} | null;

type CommentsContextValue = {
  path: string;
  comments: Comment[];
  unresolvedCount: number;
  loading: boolean;
  error: string | null;

  commentModeEnabled: boolean;
  panelOpen: boolean;
  draft: Draft;
  activeCommentId: string | null;
  pendingAuthor: null | {
    reason: "create" | "reply";
    onConfirm: (name: string) => void;
  };
  author: string | null;

  toggleMode: () => void;
  setCommentMode: (v: boolean) => void;
  togglePanel: () => void;
  setPanelOpen: (v: boolean) => void;

  placeDraft: (draft: Draft) => void;
  clearDraft: () => void;
  submitDraft: (body: string) => Promise<void>;

  addReply: (commentId: string, body: string) => Promise<void>;
  resolve: (commentId: string, resolved: boolean) => Promise<void>;
  remove: (commentId: string) => Promise<void>;

  setActiveComment: (id: string | null) => void;
  refresh: () => Promise<void>;

  setAuthor: (name: string) => void;
  resolveAuthor: (
    reason: "create" | "reply"
  ) => Promise<string | null>;
};

const CommentsContext = createContext<CommentsContextValue | null>(null);

export function useComments(): CommentsContextValue {
  const ctx = useContext(CommentsContext);
  if (!ctx) {
    throw new Error("useComments must be used within CommentsProvider");
  }
  return ctx;
}

export function CommentsProvider({ children }: { children: React.ReactNode }) {
  const path = usePathname() ?? "/";

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [commentModeEnabled, setCommentMode] = useState<boolean>(false);
  const [panelOpen, setPanelOpen] = useState<boolean>(false);
  const [draft, setDraft] = useState<Draft>(null);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);

  const [author, setAuthorState] = useState<string | null>(null);
  const pendingAuthorRef = useRef<CommentsContextValue["pendingAuthor"]>(null);
  const [pendingAuthor, setPendingAuthor] =
    useState<CommentsContextValue["pendingAuthor"]>(null);

  const mutationsInFlightRef = useRef(0);
  const refreshSeqRef = useRef(0);
  const lastAppliedSeqRef = useRef(0);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(AUTHOR_STORAGE_KEY);
      if (stored) setAuthorState(stored);
    } catch {
    }
  }, []);

  const setAuthor = useCallback((name: string) => {
    const trimmed = name.trim().slice(0, 200);
    if (!trimmed) return;
    setAuthorState(trimmed);
    try {
      window.localStorage.setItem(AUTHOR_STORAGE_KEY, trimmed);
    } catch {
    }
  }, []);

  const resolveAuthor = useCallback(
    (reason: "create" | "reply") => {
      if (author) return Promise.resolve(author);
      return new Promise<string | null>((resolvePromise) => {
        const onConfirm = (name: string) => {
          pendingAuthorRef.current = null;
          setPendingAuthor(null);
          if (!name.trim()) {
            resolvePromise(null);
            return;
          }
          setAuthor(name);
          resolvePromise(name.trim().slice(0, 200));
        };
        const entry = { reason, onConfirm };
        pendingAuthorRef.current = entry;
        setPendingAuthor(entry);
      });
    },
    [author, setAuthor]
  );

  const refresh = useCallback(async () => {
    const seq = ++refreshSeqRef.current;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/comments?path=${encodeURIComponent(path)}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = (await res.json()) as { comments: Comment[] };
      if (mutationsInFlightRef.current > 0) return;
      if (seq < lastAppliedSeqRef.current) return;
      lastAppliedSeqRef.current = seq;
      setComments(data.comments);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!panelOpen) return;
    const id = window.setInterval(() => {
      void refresh();
    }, 15_000);
    return () => window.clearInterval(id);
  }, [panelOpen, refresh]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [refresh]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          tag === "SELECT" ||
          target.isContentEditable
        ) {
          if (e.key === "Escape") {
          } else {
            return;
          }
        }
      }
      if (e.key === "Escape") {
        if (draft) {
          setDraft(null);
        } else if (commentModeEnabled) {
          setCommentMode(false);
        } else if (activeCommentId) {
          setActiveCommentId(null);
        }
        return;
      }
      if (e.key === "c" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        if (e.shiftKey) {
          setPanelOpen((p) => !p);
        } else {
          setCommentMode((v) => !v);
          setDraft(null);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [draft, commentModeEnabled, activeCommentId]);

  const placeDraft = useCallback((next: Draft) => {
    setDraft(next);
  }, []);

  const clearDraft = useCallback(() => setDraft(null), []);

  const submitDraft = useCallback(
    async (body: string) => {
      if (!draft) return;
      const text = body.trim();
      if (!text) return;

      const name = await resolveAuthor("create");
      if (!name) return;

      const payload: CreateCommentInput = {
        path,
        coords: draft.coords,
        anchor: draft.anchor,
        author: name,
        body: text,
      };

      const tempId = `temp-${Date.now()}`;
      const optimistic: Comment = {
        id: tempId,
        path,
        coords: draft.coords,
        anchor: draft.anchor,
        author: name,
        body: text,
        createdAt: Date.now(),
        resolved: false,
        replies: [],
      };
      setComments((prev) => [...prev, optimistic]);
      setDraft(null);
      setCommentMode(false);

      mutationsInFlightRef.current++;
      try {
        const res = await fetch("/api/comments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = (await res.json()) as { comment: Comment };
        setComments((prev) =>
          prev.map((c) => (c.id === tempId ? data.comment : c))
        );
        setActiveCommentId(data.comment.id);
      } catch (err) {
        setComments((prev) => prev.filter((c) => c.id !== tempId));
        setError(err instanceof Error ? err.message : "Failed to post");
      } finally {
        mutationsInFlightRef.current--;
      }
    },
    [draft, path, resolveAuthor]
  );

  const addReply = useCallback(
    async (commentId: string, body: string) => {
      const text = body.trim();
      if (!text) return;
      const name = await resolveAuthor("reply");
      if (!name) return;

      const payload: CreateReplyInput = { author: name, body: text };
      const tempReplyId = `temp-${Date.now()}`;

      setComments((current) =>
        current.map((c) =>
          c.id === commentId
            ? {
                ...c,
                replies: [
                  ...c.replies,
                  {
                    id: tempReplyId,
                    author: name,
                    body: text,
                    createdAt: Date.now(),
                  },
                ],
              }
            : c
        )
      );

      mutationsInFlightRef.current++;
      try {
        const res = await fetch(`/api/comments/${commentId}/replies`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = (await res.json()) as { comment: Comment };
        setComments((current) =>
          current.map((c) => (c.id === commentId ? data.comment : c))
        );
      } catch (err) {
        setComments((current) =>
          current.map((c) =>
            c.id === commentId
              ? { ...c, replies: c.replies.filter((r) => r.id !== tempReplyId) }
              : c
          )
        );
        setError(err instanceof Error ? err.message : "Failed to reply");
      } finally {
        mutationsInFlightRef.current--;
      }
    },
    [resolveAuthor]
  );

  const resolve = useCallback(
    async (commentId: string, resolved: boolean) => {
      setComments((current) =>
        current.map((c) => (c.id === commentId ? { ...c, resolved } : c))
      );
      mutationsInFlightRef.current++;
      try {
        const res = await fetch(`/api/comments/${commentId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resolved }),
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      } catch (err) {
        setComments((current) =>
          current.map((c) =>
            c.id === commentId ? { ...c, resolved: !resolved } : c
          )
        );
        setError(err instanceof Error ? err.message : "Failed to update");
      } finally {
        mutationsInFlightRef.current--;
      }
    },
    []
  );

  const remove = useCallback(
    async (commentId: string) => {
      let removed: Comment | null = null;
      setComments((current) => {
        removed = current.find((c) => c.id === commentId) ?? null;
        return current.filter((c) => c.id !== commentId);
      });
      if (activeCommentId === commentId) setActiveCommentId(null);
      mutationsInFlightRef.current++;
      try {
        const res = await fetch(`/api/comments/${commentId}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      } catch (err) {
        if (removed) {
          const restored = removed;
          setComments((current) => [...current, restored]);
        }
        setError(err instanceof Error ? err.message : "Failed to delete");
      } finally {
        mutationsInFlightRef.current--;
      }
    },
    [activeCommentId]
  );

  const toggleMode = useCallback(() => {
    setCommentMode((v) => {
      const next = !v;
      if (!next) setDraft(null);
      return next;
    });
  }, []);

  const togglePanel = useCallback(() => setPanelOpen((v) => !v), []);

  const setActiveComment = useCallback((id: string | null) => {
    setActiveCommentId(id);
  }, []);

  const unresolvedCount = useMemo(
    () => comments.filter((c) => !c.resolved).length,
    [comments]
  );

  const value = useMemo<CommentsContextValue>(
    () => ({
      path,
      comments,
      unresolvedCount,
      loading,
      error,
      commentModeEnabled,
      panelOpen,
      draft,
      activeCommentId,
      pendingAuthor,
      author,
      toggleMode,
      setCommentMode,
      togglePanel,
      setPanelOpen,
      placeDraft,
      clearDraft,
      submitDraft,
      addReply,
      resolve,
      remove,
      setActiveComment,
      refresh,
      setAuthor,
      resolveAuthor,
    }),
    [
      path,
      comments,
      unresolvedCount,
      loading,
      error,
      commentModeEnabled,
      panelOpen,
      draft,
      activeCommentId,
      pendingAuthor,
      author,
      toggleMode,
      togglePanel,
      placeDraft,
      clearDraft,
      submitDraft,
      addReply,
      resolve,
      remove,
      setActiveComment,
      refresh,
      setAuthor,
      resolveAuthor,
    ]
  );

  return (
    <CommentsContext.Provider value={value}>
      {children}
    </CommentsContext.Provider>
  );
}
