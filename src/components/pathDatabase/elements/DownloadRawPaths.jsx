import { getAllRawPaths } from "../databaseUtils/IndexedDB";

export function DownloadRawPaths() {
    const handleDownload = async () => {
        const data = await getAllRawPaths();
        const jsonString = JSON.stringify(data);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'paths.json';
        link.click();
        URL.revokeObjectURL(link.href);
    };

    return (
        <div style={{ position: 'absolute', top: 40, left: 10, zIndex: 1 }}>
            <button onClick={handleDownload}>Download Paths</button>
        </div>
    );
}