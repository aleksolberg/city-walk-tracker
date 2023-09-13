import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import TrackingControl from './TrackingControl';
import RawPath from './RawPath';
import SnappedPath from './SnappedPath';
import { addRawPath, getAllRawPaths, addRoadSegments, getAllRoadSegments } from './IndexedDB';
import { DownloadCSV } from './DownloadCSV';
import { ClearDatabase } from './ClearDatabase';
import { snapToRoads } from './RoadsUtils';

const containerStyle = {
    width: '100vw',
    height: '100vh'
};

let watchId = null;

function Map() {
    const [center, setCenter] = useState(null);
    const [isTracking, setIsTracking] = useState(false);
    const [currentRawPath, setCurrentRawPath] = useState([]);
    const [previousRawPaths, setPreviousRawPaths] = useState([]);
    const [currentSnappedPath, setCurrentSnappedPath] = useState([]);
    const [currentRoadSegments, setCurrentRoadSegments] = useState([]);

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


    const startTracking = () => {
        if ("geolocation" in navigator) {
            watchId = navigator.geolocation.watchPosition(
                async function (position) {
                    setCurrentRawPath(prevPath => [...prevPath, {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }]);
                    try {
                        const [snappedPoint, roadSegment] = await snapToRoads(position.coords.latitude, position.coords.longitude)
                        setCurrentSnappedPath(prevPath => [...prevPath, {
                            lat: snappedPoint.latitude,
                            lng: snappedPoint.longitude
                        }])
                        setCurrentRoadSegments(prevSegments => [...prevSegments, roadSegment])
                    } catch (error) {
                        console.error("Error snapping to road:", error);
                    }
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
