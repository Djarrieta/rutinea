import type { RoutineWithSets } from "@/types";

const DB_NAME = "rutinea-offline";
const DB_VERSION = 1;
const ROUTINES_STORE = "routines";
const ASSETS_STORE = "assets";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(ROUTINES_STORE)) {
        db.createObjectStore(ROUTINES_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(ASSETS_STORE)) {
        db.createObjectStore(ASSETS_STORE, { keyPath: "url" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/** Cache an image as a blob in IndexedDB */
async function cacheAsset(db: IDBDatabase, url: string): Promise<void> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(ASSETS_STORE, "readwrite");
      tx.objectStore(ASSETS_STORE).put({ url, blob });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Skip assets that fail to fetch — routine still usable without images
  }
}

/** Get a cached asset blob URL */
export async function getAssetUrl(url: string): Promise<string> {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(ASSETS_STORE, "readonly");
    const request = tx.objectStore(ASSETS_STORE).get(url);
    request.onsuccess = () => {
      if (request.result?.blob) {
        resolve(URL.createObjectURL(request.result.blob));
      } else {
        resolve(url);
      }
    };
    request.onerror = () => resolve(url);
  });
}

/** Collect all image URLs from a routine */
function collectImageUrls(routine: RoutineWithSets): string[] {
  const urls: string[] = [];
  for (const rs of routine.routine_sets) {
    for (const se of rs.set.set_exercises) {
      for (const img of se.exercise.images) {
        if (img.url) urls.push(img.url);
      }
    }
  }
  return [...new Set(urls)];
}

/** Save a routine and its images for offline use */
export async function saveRoutineOffline(
  routine: RoutineWithSets,
): Promise<void> {
  const db = await openDB();

  // Save routine data
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(ROUTINES_STORE, "readwrite");
    tx.objectStore(ROUTINES_STORE).put({
      id: routine.id,
      data: routine,
      savedAt: new Date().toISOString(),
    });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });

  // Cache all images
  const imageUrls = collectImageUrls(routine);
  await Promise.allSettled(imageUrls.map((url) => cacheAsset(db, url)));
}

/** Remove a routine and its unique images from offline storage */
export async function removeRoutineOffline(routineId: string): Promise<void> {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(ROUTINES_STORE, "readwrite");
    tx.objectStore(ROUTINES_STORE).delete(routineId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/** Get a single offline routine by ID */
export async function getOfflineRoutine(
  routineId: string,
): Promise<RoutineWithSets | null> {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(ROUTINES_STORE, "readonly");
    const request = tx.objectStore(ROUTINES_STORE).get(routineId);
    request.onsuccess = () => resolve(request.result?.data ?? null);
    request.onerror = () => resolve(null);
  });
}

/** Check if a routine is saved offline */
export async function isRoutineSavedOffline(
  routineId: string,
): Promise<boolean> {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(ROUTINES_STORE, "readonly");
    const request = tx.objectStore(ROUTINES_STORE).get(routineId);
    request.onsuccess = () => resolve(!!request.result);
    request.onerror = () => resolve(false);
  });
}

/** Get all routines saved offline */
export async function getAllOfflineRoutines(): Promise<RoutineWithSets[]> {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(ROUTINES_STORE, "readonly");
    const request = tx.objectStore(ROUTINES_STORE).getAll();
    request.onsuccess = () =>
      resolve((request.result ?? []).map((r: { data: RoutineWithSets }) => r.data));
    request.onerror = () => resolve([]);
  });
}
