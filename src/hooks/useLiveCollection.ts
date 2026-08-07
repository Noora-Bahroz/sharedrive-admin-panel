import { useEffect, useRef, useState } from 'react';
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  limit as fsLimit,
  startAfter,
  type QueryConstraint,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '@/firebase/config';

interface UseLiveCollectionOptions {
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
  pageSize?: number;
  extraConstraints?: QueryConstraint[];
  filterKey?: string;
}

export function useLiveCollection<T = DocumentData>(
  collectionPath: string,
  { orderByField, orderDirection = 'desc', pageSize = 25, extraConstraints = [], filterKey }: UseLiveCollectionOptions = {},
) {
  const [rows, setRows] = useState<(T & { id: string })[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cursorStack, setCursorStack] = useState<QueryDocumentSnapshot[]>([]);

  const extraConstraintsRef = useRef(extraConstraints);
  extraConstraintsRef.current = extraConstraints;

  useEffect(() => {
    setLoading(true);
    setError(null);

    let unsubscribe: (() => void) | undefined;

    try {
      const constraints: QueryConstraint[] = [...extraConstraintsRef.current];
      if (orderByField) {
        constraints.push(orderBy(orderByField, orderDirection));
      }
      constraints.push(fsLimit(pageSize));

      const currentCursor = cursorStack[cursorStack.length - 1];
      if (currentCursor) constraints.push(startAfter(currentCursor));

      const q = query(collection(db, collectionPath), ...constraints);

      unsubscribe = onSnapshot(
        q,
        (snap) => {
          try {
            setRows(snap.docs.map((d) => ({ id: d.id, ...(d.data() as T) })));
            setLastDoc(snap.docs[snap.docs.length - 1] ?? null);
            setHasMore(snap.docs.length === pageSize);
            setLoading(false);
          } catch (innerErr) {
            console.error(`Firestore snapshot callback error [${collectionPath}]:`, innerErr);
            setError(`Snapshot error: ${(innerErr as Error).message}`);
            setLoading(false);
          }
        },
        (err) => {
          console.error(`Firestore onSnapshot error [${collectionPath}]:`, err);
          setError(err.message);
          setLoading(false);
        },
      );
    } catch (syncErr) {
      console.error(`Firestore query creation error [${collectionPath}]:`, syncErr);
      setError(`Query error: ${(syncErr as Error).message}`);
      setLoading(false);
    }

    return () => {
      unsubscribe?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionPath, orderByField, orderDirection, pageSize, cursorStack, filterKey]);

  return {
    rows,
    loading,
    error,
    hasMore,
    nextPage: () => {
      if (lastDoc) setCursorStack((stack) => [...stack, lastDoc]);
    },
    prevPage: () => {
      setCursorStack((stack) => stack.slice(0, -1));
    },
    isFirstPage: cursorStack.length === 0,
  };
}
