export async function getNearestRoadNodes(lat, lng, numNodes) {
    const response = await fetch(`${process.env.REACT_APP_OSRM_SERVER_URL}/nearest/v1/foot/${lng},${lat}.json?number=${numNodes}`);
    const data = await response.json();

    if (data.waypoints && data.waypoints.length > 0) {
        return data.waypoints
        .filter(waypoint => waypoint.name)
        .map(waypoint => ({
            nodes: waypoint.nodes,
            location: waypoint.location
        }));
    }
}