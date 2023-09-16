import { clearRawPaths, clearSnappedPaths } from "../databaseUtils/IndexedDB";

const clearDatabase = async () => {
    try {
        await clearRawPaths();
        await clearSnappedPaths();
        console.log("Database cleared successfully!");
    } catch (error) {
        console.error("Error clearing the database:", error);
    }
};


export function ClearDatabase() {
    return (
        <div style={{ position: 'absolute', top: 100, left: 10, zIndex: 1 }}>
            <button onClick={clearDatabase}>Clear Database</button>
        </div>
      );
}