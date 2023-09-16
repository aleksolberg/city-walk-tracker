import { getAllRawPaths } from "../databaseUtils/IndexedDB";

function convertToCSV(paths) {
    const header = ['Session ID', 'Date', 'Latitude', 'Longitude'];
    const csvRows = [header.join(',')];  // Start with the header

    paths.forEach(session => {
        console.log(session);
        session.path.forEach(coord => {
            csvRows.push(`${session.sessionId},${session.date},${coord.lat},${coord.lng}`);
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
    const paths = await getAllRawPaths();
    const csvData = convertToCSV(paths);
    downloadCSV(csvData);
}

export function DownloadRawPathCSV() {
    return (
        <div style={{ position: 'absolute', top: 40, left: 10, zIndex: 1 }}>
            <button onClick={handleDownload}>Download Raw Paths</button>
        </div>
      );
}