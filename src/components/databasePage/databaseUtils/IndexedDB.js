import { openDB } from 'idb';

let dbPromise = null;

async function getDatabase() {
    if (!dbPromise) {
        dbPromise = openDB('PathDatabase', 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('rawPaths')) {
                    db.createObjectStore('rawPaths', { keyPath: 'sessionId', autoIncrement: true });
                }
                if (!db.objectStoreNames.contains('snappedPaths')) {
                    db.createObjectStore('snappedPaths', { keyPath: 'sessionId' });
                }
            },
        });
    }
    return dbPromise;
}

export async function saveRawPath(path) {
    const db = await getDatabase();
    const newEntry = {
        date: new Date().toISOString(),
        path: path
    };
    const sessionId = await db.add('rawPaths', newEntry);
    return sessionId;
}

export async function getAllRawPaths() {
    const db = await getDatabase();
    return db.getAll('rawPaths');
}

export async function deleteRawPath(id) {
    const db = await getDatabase();
    return db.delete('rawPaths', id);
}

export async function clearRawPaths() {
    const db = await getDatabase();
    return db.clear('rawPaths')
}

export async function saveSnappedPath(sessionId, snappedPath) {
    const db = await getDatabase();
    const segmentData = {
        sessionId: sessionId,
        snappedPath: snappedPath
    };
    return db.put('snappedPaths', segmentData);
}

export async function getAllSnappedPaths() {
    const db = await getDatabase();
    return db.getAll('snappedPaths');
}

export async function clearSnappedPaths() {
    const db = await getDatabase();
    return db.clear('snappedPaths')
}
