# Security Model — ShareDrive Admin Panel (Spark Plan)

## Overview

The ShareDrive admin system uses the **`admins/{uid}` Firestore collection** as
the source of truth for admin status, enforced server-side by **Firestore
Security Rules**. The React UI is a UX convenience — never the security boundary.
No Cloud Functions or Custom Claims are used.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     SECURITY LAYERS                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Layer 1: admins/{uid} collection (source of truth)         │
│    • Document exists = user is admin                        │
│    • Only existing admins can create/delete docs            │
│    • Prevents self-promotion (non-admin can't write)        │
│                                                             │
│  Layer 2: Firestore Security Rules (database enforcement)   │
│    • isAdmin() checks exists(/admins/{uid})                 │
│    • users/{userId} blocks role/admin field writes          │
│    • Deny-by-default: no open read/write rules              │
│    • Runs on every read/write, can't be bypassed            │
│                                                             │
│  Layer 3: Client-side route guards (UX only)               │
│    • RequireAdmin.tsx blocks non-admin UI access            │
│    • AuthContext reads admins/{uid} on login                │
│    • These are convenience, not security                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## How Admin Status is Granted

### First Admin (Manual)

The first admin is created manually by the developer in the Firebase Console:

1. Create a user via Firebase Auth (or have them sign up via the mobile app)
2. In Firestore Console, create a document at `admins/{uid}` with any content (e.g. `{}`)
3. That user can now log in to the admin panel

### Subsequent Admins

From the Manage Admins page in the admin panel:

1. Admin enters the target user's email
2. The panel looks up the user in the `users` collection
3. Creates `admins/{uid}` — Firestore rules enforce admin-only access
4. Writes audit log to `adminAuditLog`

### Revoking Admin

From the Manage Admins page:

1. Admin clicks revoke on an admin entry
2. Deletes `admins/{uid}` — Firestore rules enforce admin-only access
3. Writes audit log to `adminAuditLog`
4. Self-revocation is blocked (safety)

## Firestore Rules — Key Security Points

### Admin Check

```
function isAdmin() {
  return request.auth != null
    && exists(/databases/$(database)/documents/admins/$(request.auth.uid));
}
```

A client cannot forge this — they would need to create an `admins/{uid}`
document, which the rules block for non-admins.

### Role/Admin Field Lock (users collection)

```
match /users/{userId} {
  allow update: if request.auth != null
                && request.auth.uid == userId
                && !isChanging('role')
                && !isChanging('admin');
}
```

This rule **explicitly blocks** any client write that touches the `role` or
`admin` fields. A malicious user cannot call:

```js
updateDoc(doc(db, 'users', myUid), { role: 'admin' })
```

Because the Firestore rule will reject it.

### Admin-Only Collections

All admin panel data (rides, drivers, complaints, etc.) requires `isAdmin()`
for reads. This means even if a passenger knows a ride document ID, they
cannot read it — the rule blocks them.

## Audit Trail

The `adminAuditLog` collection tracks all admin grants/revocations:

```
adminAuditLog/{docId}
```

Each document contains:
- `action`: `'grant'` or `'revoke'`
- `targetUid`: Who was affected
- `targetEmail`: For human readability
- `performedBy`: `'admin-panel'`
- `timestamp`: When it happened

## Login Flow

1. User enters email/password on the login page
2. Firebase Auth authenticates the credentials
3. `AuthContext` reads `admins/{uid}` from Firestore
4. If document exists → `isAdmin: true` → access granted
5. If document doesn't exist → `isAdmin: false` → Access Denied
6. `ProtectedRoute` and `RequireAdmin` enforce this on every route

## Files Reference

| File | Purpose |
|------|---------|
| `firestore-rules/firestore.rules` | Database security rules (exists() admin check) |
| `src/context/AuthContext.tsx` | Reads admins/{uid} on login |
| `src/auth/useAdminClaim.ts` | Hook to check admin status from Firestore |
| `src/auth/RequireAdmin.tsx` | Route guard (UX convenience, not security) |
| `src/services/adminApi.ts` | Direct Firestore CRUD operations |
| `src/pages/ManageAdmins/ManageAdminsPage.tsx` | UI to grant/revoke admin access |
