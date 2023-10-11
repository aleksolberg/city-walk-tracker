import { getAllOsrmSessions } from "../components/pathDatabase/databaseUtils/IndexedDB";

export function calculateVisitedNodePercentage(userNodes, cityNodes) {
    // Takes a list of node IDs as both inputs
    if (!cityNodes.length) return 0;
    console.log(cityNodes);
    console.log(userNodes);
    console.log(cityNodes.filter(node => userNodes.has(node)).length)
    return cityNodes.filter(node => userNodes.has(node)).length / cityNodes.length;
}

export async function getUniqueUserNodeIds() {
    let uniqueNodes = new Set()

    const sessions = await getAllOsrmSessions();
    sessions.forEach(session => {
        session.nodes.forEach(node => {
            uniqueNodes.add(...node.nodeIds)
        })
    });
    return uniqueNodes;
}

