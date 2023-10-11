import { getAllOsrmSessions } from "../databaseUtils/IndexedDB";

export function DownloadOsrmNodes() {
    const handleDownload = async () => {
        const data = await getAllOsrmSessions();
        const jsonString = JSON.stringify(data);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'nodes.json';
        link.click();
        URL.revokeObjectURL(link.href);
    };

    return (
        <div style={{ position: 'absolute', top: 70, left: 10, zIndex: 1 }}>
            <button onClick={handleDownload}>Download Nodes</button>
        </div>
    );
}