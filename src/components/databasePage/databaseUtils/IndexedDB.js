import { openDB } from 'idb';

let dbPromise = null;

async function getDatabase() {
    if (!dbPromise) {
        dbPromise = openDB('PathDatabase', 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('rawPaths')) {
                    db.createObjectStore('rawPaths', { keyPath: 'sessionId' });
                }
                if (!db.objectStoreNames.contains('osrmNodes')) {
                    db.createObjectStore('osrmNodes', { keyPath: 'sessionId' });
                }
            },
        });
    }
    return dbPromise;
}

export async function getAllSessionIds() {
    const db = await getDatabase();
    const tx = db.transaction('rawPaths', 'readonly');
    const store = tx.objectStore('rawPaths');
    const keys = await store.getAllKeys();
    return keys;
}

export async function saveRawPath(sessionId, path) {
    const db = await getDatabase();
    const newEntry = {
        sessionId: sessionId,
        date: new Date().toISOString(),
        path: path
    };
    return db.add('rawPaths', newEntry);
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

export async function saveOsrmNodes(sessionId, osrmNodes) {
    const db = await getDatabase();
    const nodeData = {
        sessionId: sessionId,
        nodes: osrmNodes
    };
    return db.put('osrmNodes', nodeData);
}

export async function getAllOsrmNodes() {
    const db = await getDatabase();
    return db.getAll('osrmNodes');
}

export async function clearOsrmNodes() {
    const db = await getDatabase();
    return db.clear('osrmNodes')
}
