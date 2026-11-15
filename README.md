# ShareMhob — Khmer Food Recipe Sharing Platform

University project · Milestone M1 · Frontend prototype

## Run locally

Use Node.js **22.18+ (22.x)** or **24.12+** and npm.

```sh
cd M1/frontend
npm run dev
```

The existing dependencies move with the frontend; no reinstall is needed. On a fresh
checkout without `node_modules/`, run `npm ci` in `M1/frontend/` before starting.

Open the local URL printed by Vite (normally http://localhost:5173).

**Demo account:** `cook@sharemhob.test` / `Cook123!`

Register with made-up details only. Data and sessions live in memory and reset on
refresh. No backend, database, real authentication, or server uploads are implemented.

## Structure

```text
Vue_Project/
├── .git/
├── .gitignore
├── M0.pdf
├── README.md
└── M1/
    ├── docs/
    │   ├── components.md
    │   ├── m1-implementation.md
    │   ├── m1-verification.md
    │   └── wireframes/
    └── frontend/
```

The frontend uses Vue Router, Pinia, Vitest, ESLint, and Prettier. It includes recipe
browsing/filtering, details, mock accounts, owner recipe management, and reviews.

## Verify

From `M1/frontend/`:

```sh
npm run type-check
npm test
npm run lint
npm run format:check
npm run build
```

Run `npm run preview` after building for a production preview. A static host must
fall back to `index.html` for Vue Router history URLs.

## Git

This folder is an independent repository on `frontend-setup`. Its parent already
had an unrelated repository; no parent work was restored, removed, staged, or committed.
No remote, commit, or push is part of M1 setup.

See [M1 implementation notes](M1/docs/m1-implementation.md) for deferred scope and
acceptance checks, and [verification results](M1/docs/m1-verification.md).
