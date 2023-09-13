import { openDB } from 'idb';

async function setupDatabase() {
    const db = await openDB('PathDatabase', 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('rawPaths')) {
                db.createObjectStore('rawPaths', { keyPath: 'id', autoIncrement: true });
            }
        },
    });
    return db;
}

export async function addRawPath(path) {
    const db = await setupDatabase();
    const newEntry = {
        date: new Date().toISOString(),
        path: path
    };
    return db.add('rawPaths', newEntry);
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