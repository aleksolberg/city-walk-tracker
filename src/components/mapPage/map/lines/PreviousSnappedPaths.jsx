import { Polyline } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { getAllSnappedPaths } from "../../../databasePage/databaseUtils/IndexedDB";
import { useSelector } from "react-redux";

function PreviousSnappedPaths() {
    const [previousSnappedPaths, setPreviousSnappedPaths] = useState([]);

    const isTracking = useSelector(state => state.isTracking.value);

    useEffect(() => {
        async function fetchData() {
            try {
                const pathsFromDB = await getAllSnappedPaths();
                setPreviousSnappedPaths(pathsFromDB);
                console.log(`Loaded ${pathsFromDB.length} snapped paths from database.`)
            } catch (error) {
                console.error('Error fetching paths:', error);
            }
        }

        fetchData();
    }, [isTracking]);

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