import { getAllSnappedPaths } from "../databaseUtils/IndexedDB";

function convertToCSV(paths) {
    const header = ['Session ID', 'Latitude', 'Longitude', 'Road Segment'];
    const csvRows = [header.join(',')];  // Start with the header

    paths.forEach(session => {
        console.log(session);
        session.snappedPath.forEach(point => {
            csvRows.push(`${session.sessionId},${point.location.latitude},${point.location.longitude},${point.placeId}`);
        });
    });

    return csvRows.join('\n');
}

function downloadCSV(csvData, filename = 'paths.csv') {
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

async function handleDownload() {
    const paths = await getAllSnappedPaths();
    const csvData = convertToCSV(paths);
    downloadCSV(csvData);
}

export function DownloadSnappedPathCSV() {
    return (
        <div style={{ position: 'absolute', top: 70, left: 10, zIndex: 1 }}>
            <button onClick={handleDownload}>Download Road Segments</button>
        </div>
      );
}