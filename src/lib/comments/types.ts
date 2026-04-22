export type Coords = {
  x: number;
  y: number;
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
  author: string;
  body: string;
  createdAt: number;
  resolved: boolean;
  replies: Reply[];
};

export type CreateCommentInput = {
  path: string;
  coords: Coords;
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
