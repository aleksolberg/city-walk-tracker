export async function getAllNodes(areaCode) {
    const query = `
        [out:json][timeout:25];
        area(id:${areaCode})->.searchArea;
        (
            way(area.searchArea)[highway][highway!=motorway][highway!=trunk][highway!=trunk_link][name];
        );
        node(w);
        out body;
        >;
        out;
    `;

    try {
        const response = await fetch('https://overpass-api.de/api/interpreter', {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: query
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        return data.elements.map(element => {
            return {
                id: element.id,
                lat: element.lat,
                lng: element.lng
            };
        });

    } catch (error) {
        console.error("Error fetching nodes:", error);
        throw error;
    }
}


export async function getAllWays(areaCode) {
    const query = `
        [out:json][timeout:25];
        area(id:${areaCode})->.searchArea;
        way(area.searchArea)[highway][highway!=motorway][highway!=trunk][highway!=trunk_link][name];
        out body;
        >;
        out;
    `;

    try {
        const response = await fetch('https://overpass-api.de/api/interpreter', {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: query
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        let aggregatedWays = {};
        const ways = data.elements.filter(element => element.type === "way");

        ways.forEach(way => {
            const wayName = way.tags.name;
            if (!aggregatedWays[wayName]) {
                aggregatedWays[wayName] = {
                    id: way.id,
                    nodes: [],
                    tags: {
                        name: way.tags.name,
                        highway: way.tags.highway
                    }
                };
            }
            // Use a Set to ensure each node ID is unique
            const uniqueNodes = new Set([...aggregatedWays[wayName].nodes, ...way.nodes]);
            aggregatedWays[wayName].nodes = [...uniqueNodes];
        });

        return aggregatedWays;

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}