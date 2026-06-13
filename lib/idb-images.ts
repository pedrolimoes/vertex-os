"use client";

/* ==========================================================================
   Local image store (IndexedDB).
   Uploaded images never leave the browser: blobs live in IndexedDB and
   are referenced from project JSON as "idb:<id>". The editor resolves
   references to object URLs at render time.
   ========================================================================== */

const DB_NAME = "vertexos-images";
const STORE = "images";
const VERSION = 1;

export const IDB_PREFIX = "idb:";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/** Store an uploaded file; returns the "idb:<id>" reference for project JSON. */
export async function putImage(file: Blob): Promise<string> {
  const id = crypto.randomUUID();
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(file, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
  return `${IDB_PREFIX}${id}`;
}

export async function getImageBlob(ref: string): Promise<Blob | null> {
  if (!ref.startsWith(IDB_PREFIX)) return null;
  const id = ref.slice(IDB_PREFIX.length);
  const db = await openDb();
  const blob = await new Promise<Blob | null>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(id);
    req.onsuccess = () => resolve((req.result as Blob) ?? null);
    req.onerror = () => reject(req.error);
  });
  db.close();
  return blob;
}

export async function deleteImage(ref: string): Promise<void> {
  if (!ref.startsWith(IDB_PREFIX)) return;
  const id = ref.slice(IDB_PREFIX.length);
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

/**
 * Resolve every "idb:" reference in a project's blueprint to an object
 * URL, returning a ref → URL map for the canvas. Caller owns revocation.
 */
export async function resolveImageRefs(refs: string[]): Promise<Record<string, string>> {
  const unique = Array.from(new Set(refs.filter((r) => r.startsWith(IDB_PREFIX))));
  const entries = await Promise.all(
    unique.map(async (ref) => {
      try {
        const blob = await getImageBlob(ref);
        return blob ? ([ref, URL.createObjectURL(blob)] as const) : null;
      } catch {
        return null;
      }
    }),
  );
  return Object.fromEntries(entries.filter((e): e is readonly [string, string] => e !== null));
}
