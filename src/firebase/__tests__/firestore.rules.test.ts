/**
 * Firestore Security Rules Unit Tests — Spark Plan Architecture.
 *
 * Admin status is determined by exists(/admins/{uid}), not Custom Claims.
 * These tests use the Firebase Rules Unit Testing SDK against the local
 * emulator (`npm run emulators`, then `npm test`).
 *
 * Pattern: for each collection, test that non-admins are denied and
 * admins (admins/{uid} exists) are allowed.
 */
import { describe, it, beforeAll, afterAll } from 'vitest';
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'sharedrive-admin-test',
    firestore: {
      rules: readFileSync('firestore-rules/firestore.rules', 'utf8'),
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

describe('admins collection', () => {
  it('allows any authenticated user to read admins (to check own status)', async () => {
    const user = testEnv.authenticatedContext('user-1').firestore();
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'admins/admin-1'), { email: 'admin@test.com' });
    });
    await assertSucceeds(getDoc(doc(user, 'admins/admin-1')));
  });

  it('denies a non-admin from creating an admin document', async () => {
    const nonAdmin = testEnv.authenticatedContext('user-1').firestore();
    await assertFails(setDoc(doc(nonAdmin, 'admins/user-1'), { email: 'user@test.com' }));
  });

  it('allows an admin to create an admin document', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'admins/admin-1'), {});
    });
    const admin = testEnv.authenticatedContext('admin-1').firestore();
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'admins/admin-1'), {});
    });
    await assertSucceeds(setDoc(doc(admin, 'admins/user-2'), { email: 'user2@test.com' }));
  });
});

describe('users collection', () => {
  it('allows a user to read their own profile', async () => {
    const user = testEnv.authenticatedContext('user-1').firestore();
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'users/user-1'), { name: 'Test User', status: 'active' });
    });
    await assertSucceeds(getDoc(doc(user, 'users/user-1')));
  });

  it('denies a non-admin from reading another user profile', async () => {
    const nonAdmin = testEnv.authenticatedContext('user-1').firestore();
    await assertFails(getDoc(doc(nonAdmin, 'users/user-2')));
  });

  it('allows an admin to read a user profile', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'admins/admin-1'), {});
      await setDoc(doc(ctx.firestore(), 'users/user-2'), { name: 'Other User', status: 'active' });
    });
    const admin = testEnv.authenticatedContext('admin-1').firestore();
    await assertSucceeds(getDoc(doc(admin, 'users/user-2')));
  });

  it('allows a user to update their own name', async () => {
    const user = testEnv.authenticatedContext('user-1').firestore();
    await assertSucceeds(updateDoc(doc(user, 'users/user-1'), { name: 'Updated Name' }));
  });

  it('denies a user from writing role field', async () => {
    const user = testEnv.authenticatedContext('user-1').firestore();
    await assertFails(updateDoc(doc(user, 'users/user-1'), { role: 'admin' }));
  });

  it('allows an admin to suspend a user', async () => {
    const admin = testEnv.authenticatedContext('admin-1').firestore();
    await assertSucceeds(updateDoc(doc(admin, 'users/user-1'), { status: 'suspended' }));
  });

  it('blocks an admin from editing fields other than status', async () => {
    const admin = testEnv.authenticatedContext('admin-1').firestore();
    await assertFails(updateDoc(doc(admin, 'users/user-1'), { email: 'changed@example.com' }));
  });
});

describe('drivers collection', () => {
  it('allows an admin to approve a driver', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'admins/admin-1'), {});
      await setDoc(doc(ctx.firestore(), 'drivers/driver-1'), { verificationStatus: 'pending' });
    });
    const admin = testEnv.authenticatedContext('admin-1').firestore();
    await assertSucceeds(updateDoc(doc(admin, 'drivers/driver-1'), { verificationStatus: 'approved' }));
  });

  it('denies a non-admin from updating a driver', async () => {
    const nonAdmin = testEnv.authenticatedContext('user-1').firestore();
    await assertFails(updateDoc(doc(nonAdmin, 'drivers/driver-1'), { verificationStatus: 'approved' }));
  });
});
