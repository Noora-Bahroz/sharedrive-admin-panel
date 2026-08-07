import { useEffect, useRef, useState } from 'react';
import { collection, query, getCountFromServer, type QueryConstraint } from 'firebase/firestore';
import { db } from '@/firebase/config';

export function useCollectionCount(collectionPath: string, constraints: QueryConstraint[] = [], refreshMs = 30_000) {
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const constraintsRef = useRef(constraints);
  constraintsRef.current = constraints;

  useEffect(() => {
    let cancelled = false;

    const fetchCount = async () => {
      try {
        const q = query(collection(db, collectionPath), ...constraintsRef.current);
        const snap = await getCountFromServer(q);
        if (!cancelled) {
          setCount(snap.data().count);
          setError(null);
        }
      } catch (err) {
        console.error(`Count error [${collectionPath}]:`, err);
        if (!cancelled) setError((err as Error).message);
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, refreshMs);
    return () => { cancelled = true; clearInterval(interval); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionPath, refreshMs]);

  return { count, error };
}
