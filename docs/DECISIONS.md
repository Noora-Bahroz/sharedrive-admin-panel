# Architecture decisions

These resolve the ambiguities in the original spec. Each maps to a fix from
the plan review.

### 1. Backend: Cloud Functions, not a separate FastAPI + Render service
The spec named Firebase, FastAPI, and Render all at once. Cloud Functions
(`functions/src/index.ts`) share auth and Firestore with the client SDK
already — no separate service to deploy, secure, or CORS-configure.
**Rule of thumb**: plain reads and single-field client-owned writes go
straight through the Firestore SDK + security rules; anything touching
Auth directly, spanning multiple documents atomically, or granting a
privilege goes through a callable function.

### 2. Admin role: Firebase Auth custom claims
Not just membership in an `admins` Firestore collection. Set via
`grantAdminRole`/`revokeAdminRole` (Admin SDK only). Read on the client via
`user.getIdTokenResult().claims.admin`, and in security rules via
`request.auth.token.admin`. Cheaper (no extra document read per rule
check) and sets up multi-admin roles (`admin` vs `super_admin`) cleanly
later.

### 3. Live data: react-firebase-hooks-style `onSnapshot`, not React Query, for Firestore reads
React Query is reserved for the Cloud Function calls in `services/adminApi.ts`
(one-shot request/response — retries and cache make sense there). Firestore
reads use `useLiveCollection` (`onSnapshot` underneath) so the dashboard and
tables update live without manual invalidation.

### 4. Pagination: cursor-based, built into `useLiveCollection`
`startAfter` cursors stack as the admin pages forward; each page
re-subscribes so the *visible* page stays live without loading the whole
collection. KPI counts use `getCountFromServer` instead of downloading rows
just to call `.length`.

### 5. Sensitive documents: signed URLs, 5-minute expiry, no public Storage rules
CNIC and license images are government ID data. Storage rules block all
reads (`storage.rules`); the only way to view a document is
`getSignedDocumentUrl`, called only when an admin opens the viewer, and it
expires on its own — nothing to revoke or leak via a cached URL.

### 6. Testing: security rules first
The highest-risk-to-value test for an admin panel is proving the rules
actually keep non-admins out — see `src/firebase/__tests__/firestore.rules.test.ts`.
Decided before writing pages, not retrofitted after.

### 7. Scope: MVP first
Auth + Dashboard + Users + Drivers + Rides are real in this scaffold.
Complaints/Notifications/Analytics/Settings/Profile are nav placeholders —
see `docs/ROADMAP.md` for why each is Phase 2.

### 8. Theme: dark cinematic shell, quiet inside the tables
Sidebar/topbar/cards keep the ShareDrive lime-on-black brand language. Data
tables use flat status chips (10% color tint, not glow) so dense rows of
numbers stay scannable. The one animated element in the whole app is the
`StatusPulse` dot, and only on genuinely live statuses (in-progress ride,
pending driver) — see `src/theme/tokens.ts` for the full rationale.
