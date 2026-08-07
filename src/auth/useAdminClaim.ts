/**
 * useAdmin.ts — Hook that checks if the current user is an admin.
 *
 * On the Spark plan, admin status is determined by reading the admins/{uid}
 * document from Firestore.  There are no Custom Claims.
 *
 * SECURITY NOTE: This is a UX convenience, not the security boundary.
 * The real authorization is enforced by Firestore Security Rules which
 * check exists(/admins/{request.auth.uid}) on every request.
 */

import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';

interface AdminState {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  refreshAdmin: () => Promise<void>;
}

export function useAdminClaim(): AdminState {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdmin = async (u: User | null) => {
    if (!u) {
      setUser(null);
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    try {
      const adminDoc = await getDoc(doc(db, 'admins', u.uid));
      setIsAdmin(adminDoc.exists());
    } catch {
      setIsAdmin(false);
    }
    setUser(u);
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      checkAdmin(u);
    });
    return unsubscribe;
  }, []);

  const refreshAdmin = async () => {
    const current = auth.currentUser;
    if (!current) return;
    await checkAdmin(current);
  };

  return { user, isAdmin, loading, refreshAdmin };
}
