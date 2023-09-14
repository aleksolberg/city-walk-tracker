import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import TrackingControl from './TrackingControl';
import RawPath from './RawPath';
import SnappedPath from './SnappedPath';
import { addRawPath, getAllRawPaths, addRoadSegments, getAllRoadSegments } from './IndexedDB';
import { DownloadCSV } from './DownloadCSV';
import { ClearDatabase } from './ClearDatabase';
import { snapPointToRoad, snapPointsToRoads } from './RoadsUtils';
import { computeDistance } from './MapUtils';
import Papa, { parse } from 'papaparse';

const containerStyle = {
    width: '100vw',
    height: '100vh'
};

const geolocationThreshold = 10;
let watchId = null;

function Map() {
    const [center, setCenter] = useState(null);
    const [isTracking, setIsTracking] = useState(false);
    const [currentRawPath, setCurrentRawPath] = useState([]);
    const [previousRawPaths, setPreviousRawPaths] = useState([]);
    const [unsnappedPoints, setUnsnappedPoints] = useState([]);
    const [currentSnappedPath, setCurrentSnappedPath] = useState([]);
    const [currentRoadSegments, setCurrentRoadSegments] = useState(new Set());

    useEffect(() => {
        // Fetch initial geolocation
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    setCenter({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                function (error) {
                    console.error("Error obtaining geolocation: ", error);
                }
            );
        } else {
            console.warn("Geolocation is not supported by this browser.");
        }
    }, []);

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
    }, []);

    /*useEffect(() => {
        fetch('/testpaths/paths.csv')
            .then(response => response.text())
            .then(csv => {
                return Papa.parse(csv, { header: true, skipEmptyLines: true }).data.map(
                    point => ({
                        lat: Number(point['Latitude']),
                        lng: Number(point['Longitude'])
                    })
                ).filter((_,i) => i % 5 === 0).slice(0, 50); 
            }).then(parsedData => {
                setCurrentRawPath(parsedData)
                return snapPointsToRoads(parsedData)}
            ).then(placeIds => console.log(placeIds))
    }, []);*/


    const startTracking = () => {
        if ("geolocation" in navigator) {
            watchId = navigator.geolocation.watchPosition(
                function (position) {
                    const newPoint = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
    
                    setCurrentRawPath(prevPath => {
                        if (prevPath.length > 0) {
                            const lastPoint = prevPath[prevPath.length - 1];
                            const distance = computeDistance(lastPoint.lat, lastPoint.lng, newPoint.lat, newPoint.lng);
    
                            if (distance > geolocationThreshold) {
                                setUnsnappedPoints(prevUnsyncedPath => {
                                    if (prevUnsyncedPath.length > 49) {
                                        handleBulkSnapping(prevUnsyncedPath);
                                        return [newPoint];
                                    } else {
                                        return [...prevUnsyncedPath, newPoint];
                                    }
                                })
                                return [...prevPath, newPoint];  
                            } else {
                                return prevPath; 
                            }
                        } else {
                            return [...prevPath, newPoint];  // If no previous path, add newPoint
                        }
                    });
                },
                function (error) {
                    console.error("Error while tracking: ", error);
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 0,
                    timeout: 5000
                }
            );
            setIsTracking(true);
        } else {
            console.warn("Geolocation is not supported by this browser.");
        }
    };
    
    const handleBulkSnapping = async (points) => {
        try {
            const snappedPoints = await snapPointsToRoads(points);
            setCurrentSnappedPath(prevSnappedPath => [...prevSnappedPath, ...snappedPoints.map(point => ({
                lat: point.location.latitude,
                lng: point.location.longitude
            }))]);
    
            // Handle any additional state updates for road segments if required
    
        } catch (error) {
            console.error("Error snapping to roads:", error);
        }
    };

    const stopTracking = async () => {
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
            setIsTracking(false);
            try {
                const sessionId = await addRawPath(currentRawPath);
                await addRoadSegments(sessionId, currentRoadSegments)
                console.log('Path saved successfully!');
            } catch (error) {
                console.error('Error saving path:', error);
            }
        }
    };

    return (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <div style={{ position: 'relative' }}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center || undefined}
                    zoom={15}
                    options={{
                        mapTypeControl: false,
                        streetViewControl: false,
                        fullscreenControl: false,
                        styles: [
                            {
                                featureType: "poi",
                                elementType: "labels",
                                stylers: [{ visibility: "off" }]
                            },
                            {
                                featureType: "transit",
                                elementType: "labels",
                                stylers: [{ visibility: "off" }]
                            }
                        ]
                    }}
                >
                    <RawPath pathData={currentRawPath} />
                    <SnappedPath pathData={currentSnappedPath} />
                    {previousRawPaths.map((path, index) => (
                        <RawPath key={index} pathData={path} />
                    ))}
                </GoogleMap>
                <TrackingControl
                    isTracking={isTracking}
                    startTracking={startTracking}
                    stopTracking={stopTracking}
                />
                <DownloadCSV />
                <ClearDatabase />
            </div>
        </LoadScript>
    );
}

export default Map;
