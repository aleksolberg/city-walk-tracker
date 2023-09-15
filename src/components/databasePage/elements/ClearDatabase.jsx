import { clearRawPaths, clearRoadSegments } from "../databaseUtils/IndexedDB";

const clearDatabase = async () => {
    try {
        await clearRawPaths();
        await clearRoadSegments();
        console.log("Database cleared successfully!");
    } catch (error) {
        console.error("Error clearing the database:", error);
    }
};


export function ClearDatabase() {
    return (
        <div style={{ position: 'absolute', top: 70, left: 10, zIndex: 1 }}>
            <button onClick={clearDatabase}>Clear Database</button>
        </div>
      );
}