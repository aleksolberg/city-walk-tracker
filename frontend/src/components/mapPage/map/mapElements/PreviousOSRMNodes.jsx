import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getAllOsrmNodes } from "../../../databasePage/databaseUtils/IndexedDB";
import { Circle } from "@react-google-maps/api";

function PreviousOSRMNodes() {
    const [previousNodes, setPreviousNodes] = useState([]);

    const isTracking = useSelector(state => state.isTracking.value);

    useEffect(() => {
        if (!isTracking) {
            async function fetchData() {
                try {
                    const sessionsFromDB = await getAllOsrmNodes();
                    for (let session of sessionsFromDB) {
                        setPreviousNodes(prevNodes => [...prevNodes, ...session.nodes]);
                    }
                    console.log(`Loaded ${sessionsFromDB.length} sessions from node database.`)
                } catch (error) {
                    console.error('Error fetching paths:', error);
                }
            }

            fetchData();
        }
    }, [isTracking]);

    return (
        <>
            {previousNodes.map((node, index) => (
                <Circle
                    key={index}
                    center={{ lat: node.lat, lng: node.lng }}
                    radius={3}
                    options={{
                        fillColor: "rgba(0,0,0,0)",
                        fillOpacity: 1,
                        strokeColor: "#00FF00",
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                    }}
                />
            ))}
        </>
    );
}

export default PreviousOSRMNodes;