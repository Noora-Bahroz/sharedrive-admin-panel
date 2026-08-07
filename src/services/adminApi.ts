/**
 * adminApi.ts — Firestore CRUD operations for the admin panel.
 *
 * On the Spark plan, all operations go directly through the Firestore
 * client SDK.  No Cloud Functions, no Custom Claims.
 *
 * SECURITY: Firestore Security Rules enforce authorization:
 *   - admins collection: only existing admins can write
 *   - users collection: admins can update status only
 *   - drivers collection: admins can update verification status only
 */

import {
  collection, getDocs, doc, getDoc, setDoc, deleteDoc,
  query, where, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/firebase/config';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AdminEntry {
  uid: string;
  email: string | null;
  displayName: string | null;
  grantedAt: unknown;
  grantedBy: string;
}

// ---------------------------------------------------------------------------
// Admin management — direct Firestore CRUD
// ---------------------------------------------------------------------------

/**
 * List all admins from the admins collection.
 */
export async function listAdmins(): Promise<AdminEntry[]> {
  const snap = await getDocs(collection(db, 'admins'));
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      uid: d.id,
      email: data.email ?? null,
      displayName: data.displayName ?? null,
      grantedAt: data.createdAt ?? null,
      grantedBy: data.grantedBy ?? 'unknown',
    };
  });
}

/**
 * Grant admin access by email.
 * Looks up the user in the users collection, then creates admins/{uid}.
 * The Firestore rules require the caller to be an existing admin.
 */
export async function grantAdmin(targetEmail: string): Promise<{ success: boolean; targetUid: string }> {
  // Find user by email in the users collection
  const usersQuery = query(collection(db, 'users'), where('email', '==', targetEmail));
  const usersSnap = await getDocs(usersQuery);

  if (usersSnap.empty) {
    throw new Error(`No user found with email "${targetEmail}". The user must have signed up at least once.`);
  }

  const userDoc = usersSnap.docs[0];
  const targetUid = userDoc.id;
  const userData = userDoc.data();

  // Check if already an admin
  const existingAdmin = await getDoc(doc(db, 'admins', targetUid));
  if (existingAdmin.exists()) {
    throw new Error(`"${targetEmail}" is already an admin.`);
  }

  // Create admins/{uid} document — Firestore rules enforce admin-only
  await setDoc(doc(db, 'admins', targetUid), {
    email: targetEmail,
    displayName: userData.name ?? null,
    createdAt: serverTimestamp(),
    grantedBy: 'admin-panel',
  });

  // Write audit log
  await setDoc(doc(db, 'adminAuditLog', `grant-${targetUid}-${Date.now()}`), {
    action: 'grant',
    targetUid,
    targetEmail,
    performedBy: 'admin-panel',
    timestamp: serverTimestamp(),
  });

  return { success: true, targetUid };
}

/**
 * Revoke admin access.
 * Deletes admins/{uid}.  An admin cannot revoke their own access.
 */
export async function revokeAdmin(targetUid: string): Promise<{ success: boolean; targetUid: string }> {
  const currentUid = (await import('firebase/auth')).getAuth().currentUser?.uid;
  if (currentUid === targetUid) {
    throw new Error('You cannot revoke your own admin access.');
  }

  // Get admin info before deleting for audit log
  const adminDoc = await getDoc(doc(db, 'admins', targetUid));
  if (!adminDoc.exists()) {
    throw new Error('User is not an admin.');
  }

  const adminData = adminDoc.data();

  // Delete admins/{uid} — Firestore rules enforce admin-only
  await deleteDoc(doc(db, 'admins', targetUid));

  // Write audit log
  await setDoc(doc(db, 'adminAuditLog', `revoke-${targetUid}-${Date.now()}`), {
    action: 'revoke',
    targetUid,
    targetEmail: adminData.email ?? null,
    performedBy: 'admin-panel',
    timestamp: serverTimestamp(),
  });

  return { success: true, targetUid };
}

// ---------------------------------------------------------------------------
// Driver management — direct Firestore writes
// ---------------------------------------------------------------------------

/**
 * Approve a driver — updates verificationStatus to 'approved'.
 */
export async function approveDriver(driverId: string): Promise<{ success: boolean }> {
  await updateDoc(doc(db, 'drivers', driverId), {
    verificationStatus: 'approved',
    rejectionReason: null,
    verifiedAt: serverTimestamp(),
  });
  return { success: true };
}

/**
 * Reject a driver — updates verificationStatus to 'rejected' with reason.
 */
export async function rejectDriver(driverId: string, reason: string): Promise<{ success: boolean }> {
  await updateDoc(doc(db, 'drivers', driverId), {
    verificationStatus: 'rejected',
    rejectionReason: reason,
    verifiedAt: serverTimestamp(),
  });
  return { success: true };
}

// ---------------------------------------------------------------------------
// User management — direct Firestore writes
// ---------------------------------------------------------------------------

/**
 * Suspend or activate a user.
 */
export async function toggleUserStatus(userId: string, currentStatus: string): Promise<{ success: boolean }> {
  const next = currentStatus === 'active' ? 'suspended' : 'active';
  await updateDoc(doc(db, 'users', userId), { status: next });
  return { success: true };
}

/**
 * Delete a user document (not Firebase Auth — that requires Admin SDK).
 */
export async function deleteUser(userId: string): Promise<{ success: boolean }> {
  await deleteDoc(doc(db, 'users', userId));
  return { success: true };
}

// ---------------------------------------------------------------------------
// Ride management — direct Firestore writes
// ---------------------------------------------------------------------------

/**
 * Cancel a ride.
 */
export async function cancelRide(rideId: string, cancelledBy: string): Promise<{ success: boolean }> {
  await updateDoc(doc(db, 'rides', rideId), {
    status: 'cancelled',
    cancelledBy,
    cancelledAt: serverTimestamp(),
  });
  return { success: true };
}

// ---------------------------------------------------------------------------
// Complaint management — direct Firestore writes
// ---------------------------------------------------------------------------

/**
 * Resolve a complaint.
 */
export async function resolveComplaint(complaintId: string, resolvedBy: string): Promise<{ success: boolean }> {
  await updateDoc(doc(db, 'complaints', complaintId), {
    status: 'resolved',
    resolvedBy,
    resolvedAt: serverTimestamp(),
  });
  return { success: true };
}

// ---------------------------------------------------------------------------
// Document viewer — direct Storage download URL
// ---------------------------------------------------------------------------

/**
 * Get a download URL for a Storage file.
 * Uses Firebase Storage's getDownloadURL which respects Security Rules.
 */
export async function getDocumentUrl(storagePath: string): Promise<{ url: string }> {
  const { ref, getDownloadURL } = await import('firebase/storage');
  const { storage } = await import('@/firebase/config');
  const fileRef = ref(storage, storagePath);
  const url = await getDownloadURL(fileRef);
  return { url };
}
