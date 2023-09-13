export async function snapToRoads(lat, lng) {
    const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const response = await fetch(`https://roads.googleapis.com/v1/snapToRoads?path=${lat},${lng}&key=${API_KEY}`);
    const data = await response.json();

    if (data.snappedPoints && data.snappedPoints.length > 0) {
        return [data.snappedPoints[0].location, data.snappedPoints[0].placeId];
    }

    throw new Error("No snapped points returned from Roads API");
}