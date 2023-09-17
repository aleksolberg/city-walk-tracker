import { Polyline } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { getAllSnappedPaths } from "../../../databasePage/databaseUtils/IndexedDB";

function PreviousSnappedPaths({refreshFlag}) {
    const [previousSnappedPaths, setPreviousSnappedPaths] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const pathsFromDB = await getAllSnappedPaths();
                console.log(pathsFromDB)
                setPreviousSnappedPaths(pathsFromDB);
                console.log(`Loaded ${pathsFromDB.length} snapped paths from database.`)
            } catch (error) {
                console.error('Error fetching paths:', error);
            }
        }

        fetchData();
    }, [refreshFlag]);

    return previousSnappedPaths.length > 0 ? (
        previousSnappedPaths.map((prevPath, index) => (
            <Polyline key={index}
                path={prevPath.snappedPath.map((path, index) => ({
                    lat: path.location.latitude,
                    lng: path.location.longitude
                }
                ))}
                options={{
                    strokeColor: "#FF00FF",
                    strokeOpacity: 0.8,
                    strokeWeight: 2
                }}
            />
        ))) : null
}

export default PreviousSnappedPaths;