import { useEffect, useState } from "react";
import { getAllNodes, getAllWays } from "../../../utils/overpass";
import { calculateVisitedNodePercentage, getUniqueUserNodeIds, getUniqueUserNodes } from "../../../utils/StatisticsUtils";

function Statistics() {
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        const getPercentage = async () => {
            try {
                const cityNodes = await getAllNodes(3601279942);
                const userNodes = await getUniqueUserNodeIds();
                const calculatedPercentage = calculateVisitedNodePercentage(userNodes, cityNodes.map(node => node.id));
                setPercentage(calculatedPercentage);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        getPercentage();
    }, []);

    return (
        <div>
            <p>You have discovered {percentage*100} % of Grunerløkka</p>
        </div>
    );
}

export default Statistics;