import { nodeDistanceThreshold } from "../../../../../config/constants";

export async function getNearestRoadNodes(lat, lng, numNodes) {
    const response = await fetch(`${process.env.REACT_APP_OSRM_SERVER_URL}/nearest/v1/foot/${lng},${lat}.json?number=${numNodes}`);
    console.log(`${process.env.REACT_APP_OSRM_SERVER_URL}/nearest/v1/foot/${lng},${lat}.json?number=${numNodes}`)
    const data = await response.json();

    if (data.waypoints && data.waypoints.length > 0) {
        return data.waypoints
        .filter(waypoint => waypoint.name)
        .filter(waypoint => waypoint.distance <= nodeDistanceThreshold)
        .map(waypoint => ({
            lat: waypoint.location[1],
            lng: waypoint.location[0],
            nodeIds: waypoint.nodes
        }));
    }
}