export type Coords = {
  x: number;
  y: number;
};

export type AnchorSub = {
  path: string;
  label?: string;
};

export type Anchor = {
  id: string;
  label?: string;
  offset: Coords;
  sub?: AnchorSub | null;
};

export type Reply = {
  id: string;
  author: string;
  body: string;
  createdAt: number;
};

export type Comment = {
  id: string;
  path: string;
  coords: Coords;
  anchor?: Anchor | null;
  author: string;
  body: string;
  createdAt: number;
  resolved: boolean;
  replies: Reply[];
};

export type CreateCommentInput = {
  path: string;
  coords: Coords;
  anchor?: Anchor | null;
  author: string;
  body: string;
};

export type CreateReplyInput = {
  author: string;
  body: string;
};

export type UpdateCommentInput = {
  body?: string;
  resolved?: boolean;
};
