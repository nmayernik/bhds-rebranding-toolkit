"use client";

import { AuthorPrompt } from "./AuthorPrompt";
import { CommentsFAB } from "./CommentsFAB";
import { CommentsProvider } from "./CommentsProvider";
import { CommentSurface } from "./CommentSurface";

export function CommentsRoot() {
  return (
    <CommentsProvider>
      <CommentSurface />
      <CommentsFAB />
      <AuthorPrompt />
    </CommentsProvider>
  );
}
