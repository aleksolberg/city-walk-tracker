import { openDB } from 'idb';

async function setupDatabase() {
    const db = await openDB('PathDatabase', 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('rawPaths')) {
                db.createObjectStore('rawPaths', { keyPath: 'sessionId', autoIncrement: true });
            }
            if (!db.objectStoreNames.contains('roadSegments')) {
                db.createObjectStore('roadSegments', { keyPath: 'sessionId'});
            }
        },
    });
    return db;
}

export async function saveRawPath(path) {
    const db = await setupDatabase();
    const newEntry = {
        date: new Date().toISOString(),
        path: path
    };
    const sessionId = await db.add('rawPaths', newEntry);
    return sessionId;
}

export async function getAllRawPaths() {
    const db = await setupDatabase();
    return db.getAll('rawPaths');
}

export async function deleteRawPath(id) {
    const db = await setupDatabase();
    return db.delete('rawPaths', id);
}

export async function clearRawPaths() {
    const db = await setupDatabase();
    return db.clear('rawPaths')
}

export async function saveRoadSegments(sessionId, roadSegmentIds) {
    const db = await setupDatabase();
    const segmentData = {
        sessionId: sessionId,
        segmentIds: roadSegmentIds
    };
    return db.put('roadSegments', segmentData);
}

export async function getAllRoadSegments() {
    const db = await setupDatabase();
    return db.getAll('roadSegments');
}

export async function clearRoadSegments() {
    const db = await setupDatabase();
    return db.clear('roadSegments')
}