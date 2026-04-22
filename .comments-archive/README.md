# Comment archive

This folder is the canonical, forever history of in-app comments on the BHDS
showcase. It is maintained automatically by the `Archive comments` GitHub
Action (see `.github/workflows/archive-comments.yml`).

## Layout

- `latest.json` — the most recent snapshot of every comment across every
  path. Always overwritten on change. Safe to diff against earlier commits
  to see exactly what changed and when.
- `snapshots/<iso-timestamp>.json` — a copy of `latest.json` written only
  when content actually changed, stamped with the UTC time of capture.
  These accumulate over time and give you a time-indexed audit trail.

## Snapshot shape

```jsonc
{
  "snapshotAt": "2026-04-22T18:00:00.000Z",
  "totals": {
    "paths": 3,
    "comments": 12,
    "replies": 4,
    "unresolved": 7
  },
  "commentsByPath": {
    "/compare": [ /* Comment[] ordered by createdAt */ ],
    "/components": [ /* ... */ ]
  }
}
```

Key order and per-path comment order are stable so git diffs stay minimal
between runs.

## How to trigger a manual snapshot

1. Go to the repo's Actions tab.
2. Select **Archive comments**.
3. Click **Run workflow**.

## Required configuration

- Repo secret `ARCHIVE_TOKEN` — any strong random string. Must match the
  `ARCHIVE_TOKEN` env var set on the Vercel production environment.
- Repo variable `SHOWCASE_BASE_URL` — e.g. `https://bhds-rebranding-toolkit.vercel.app`.

The export endpoint (`/api/comments/export`) is token-gated via a `Bearer`
header so it bypasses the password gate but stays private.
