import { Polyline } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { getAllRawPaths } from "../../../databasePage/databaseUtils/IndexedDB";
import { useSelector } from "react-redux";

function PreviousRawPaths() {
    const [previousRawPaths, setPreviousRawPaths] = useState([]);

    const isTracking = useSelector(state => state.isTracking.value);

    useEffect(() => {
        async function fetchData() {
            try {
                const pathsFromDB = await getAllRawPaths();
                setPreviousRawPaths(pathsFromDB);
                console.log(`Loaded ${pathsFromDB.length} raw paths from database.`)
            } catch (error) {
                console.error('Error fetching paths:', error);
            }
        }

        fetchData();
    }, [isTracking]);

    return previousRawPaths.length > 0 ? (
        previousRawPaths.map((prevPath, index) => (
            <Polyline key={index}
                path={prevPath.path}
                options={{
                    strokeColor: "#0000FF",
                    strokeOpacity: 0.8,
                    strokeWeight: 2
                }}
            />
        ))) : null
}

export default PreviousRawPaths;