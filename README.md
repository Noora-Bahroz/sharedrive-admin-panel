# ShareDrive Admin Panel

Admin dashboard for the ShareDrive ride-sharing platform (Swat/Mingora).
Companion to the passenger/driver React Native app.

**Start here:** `docs/DECISIONS.md` (why the architecture looks the way it
does) and `docs/ROADMAP.md` (what's built vs. Phase 2).

## Stack
React 19 · TypeScript · Vite · MUI · React Hook Form + Zod · TanStack Query
· Firebase (Auth, Firestore, Storage, Cloud Functions) · Recharts

## Setup

```bash
npm install

# copy and fill in your Firebase project config
cp .env.example .env

# local dev against the Firebase emulator suite (recommended while building)
npm run emulators      # in one terminal
npm run dev             # in another

# run security-rules + unit tests
npm test
```

Deploy Cloud Functions and rules:
```bash
firebase deploy --only functions,firestore:rules,storage:rules
```

## Bootstrapping the first admin
Custom claims can only be granted by an existing admin (see
`docs/DECISIONS.md` #2), so the very first admin has to be set manually
once, e.g. via a one-off script using the Admin SDK:

```js
admin.auth().setCustomUserClaims('<first-admin-uid>', { admin: true });
```

## Folder structure
Matches the original spec's layout (`src/components`, `src/pages`,
`src/hooks`, `src/services`, `src/routes`, `src/firebase`, `src/types`,
`src/utils`, `src/context`), plus `functions/` for the Cloud Functions
backend and `firestore-rules/` / `storage-rules/` for security rules.
