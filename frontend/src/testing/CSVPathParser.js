import Papa from 'papaparse';

export function parseCSV() {
    return new Promise((resolve, reject) => {
        fetch('/testpaths/paths2.csv')
            .then(response => response.text())
            .then(data => {
                Papa.parse(data, {
                    complete: function (results) {
                        const data = results.data;

                        // Checking if headers are as expected
                        if (data[0][0] !== "Session ID" || data[0][1] !== "Date" || data[0][2] !== "Latitude" || data[0][3] !== "Longitude") {
                            reject("Unexpected headers");
                            return;
                        }

                        // Transform the data
                        const transformedData = data.slice(1).map(row => ({
                            lat: parseFloat(row[2]),
                            lng: parseFloat(row[3])
                        }));

                        resolve(transformedData);
                    },
                    error: function (error) {
                        reject(error);
                    }
                });
            })
            .catch(error => {
                reject("Failed to fetch CSV.");
            });
    });
}