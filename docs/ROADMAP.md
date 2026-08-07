# ShareDrive Admin Panel — Roadmap

Split into two phases so the scope matches a solo dev working around a
graduation timeline. Everything in Phase 1 is scaffolded and working in
this repo; Phase 2 has nav placeholders only.

## Phase 1 — MVP (built in this scaffold)

| Feature | Status | Notes |
|---|---|---|
| Auth (login, forgot password, protected routes) | ✅ Done | Custom claims, not Firestore membership — see `docs/DECISIONS.md` |
| Dashboard KPIs + growth chart | ✅ Done | Counts use `getCountFromServer`, not full-collection downloads |
| User management (list, search, filter, suspend/activate) | ✅ Done | Cursor pagination via `useLiveCollection` |
| Driver verification (approve/reject, document viewer) | ✅ Done | Documents via 5-minute signed URLs, never public |
| Ride management (list, filter by status) | ✅ Done | Read-only in Phase 1; cancel-ride action is Phase 2 |

## Phase 2 — after MVP ships

| Feature | Why it's Phase 2 |
|---|---|
| Complaint management | Needs its own evidence-upload + resolution workflow, similar shape to driver docs |
| Notifications (send to audience segments) | Needs a fan-out strategy (Cloud Function + FCM), not just a Firestore write |
| Full analytics (revenue, completion rate, most active users) | Needs scheduled aggregation Cloud Functions — computing this live from raw collections doesn't scale |
| Settings | Low complexity, low urgency — do last |
| Multi-admin support + audit logs | `grantAdminRole`/`revokeAdminRole` functions already exist; needs a UI + an audit log collection |
| Real-time ride tracking on a map | Needs a maps integration decision (same Google Maps API key as the rider/driver apps) |
| Export to CSV/PDF | Bolt-on once the underlying tables are stable |

## Testing strategy (decided upfront, see `docs/DECISIONS.md` #6)

- **Security rules**: `firebase-rules-unit-testing` against the local emulator — the highest-value tests for an admin-only panel. See `src/firebase/__tests__/firestore.rules.test.ts`.
- **Cloud Functions**: unit test with the Functions test SDK + emulator (add as Phase 1 functions grow).
- **Components**: light `@testing-library/react` coverage on the data-heavy pieces (tables, status logic), not exhaustive snapshot tests.
