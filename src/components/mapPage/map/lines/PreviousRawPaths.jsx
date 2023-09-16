import { Polyline } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { getAllRawPaths } from "../../../databasePage/databaseUtils/IndexedDB";

function PreviousRawPaths({refreshFlag}) {
    const [previousRawPaths, setPreviousRawPaths] = useState([]);

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
    }, [refreshFlag]);

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