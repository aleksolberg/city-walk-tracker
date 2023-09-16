import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import TrackingControl from './TrackingControl';
import CurrentRawPath from './lines/CurrentRawPath';
import SnappedPath from './lines/CurrentSnappedPath';
import { DownloadRawPathCSV } from '../../databasePage/elements/DownloadRawPathCSV';
import { DownloadSnappedPathCSV } from '../../databasePage/elements/DownloadSnappedPathCSV';
import { ClearDatabase } from '../../databasePage/elements/ClearDatabase';
import PreviousRawPaths from './lines/PreviousRawPaths';
//import { parseCSV } from '../../../testing/CSVPathParser';
//import { snapPointsToRoads } from './lines/linesUtils/RoadSnapping';

const containerStyle = {
    width: '100vw',
    height: '100vh'
};

function Map() {
    const [center, setCenter] = useState(null);
    const [currentSnappedPath, setCurrentSnappedPath] = useState([]);
    const [currentRawPath, setCurrentRawPath] = useState([]);
    const [isTracking, setIsTracking] = useState(false);
    const [userLocation, setUserLocation] = useState(null);

    /*useEffect(() => {
        console.log('currentRawPath updated:', currentRawPath);
    }, [currentRawPath]);

    useEffect(() => {
        parseCSV().then(path => {
            setCurrentRawPath(path.slice(0, 98));
            snapPointsToRoads(path.slice(0, 98)).then(snappedPoints => {
                setCurrentSnappedPath(prevSnappedPath => [...prevSnappedPath, ...snappedPoints.map(point => ({
                    lat: point.location.latitude,
                    lng: point.location.longitude
                  }))])}
            )
        })
    }, [])*/

    // Fetch initial location and set center
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                const userLoc = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setCenter(userLoc);
                setUserLocation(userLoc);  // <-- Add this line
            },
                error => { console.error("Error obtaining geolocation: ", error) }
            );
        } else {
            console.warn("Geolocation is not supported by this browser.");
        }
    }, []);


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
                    {userLocation && (
                        <Marker
                            position={userLocation}
                            icon={{
                                url: "bluedot.png",  // You can use a blue dot icon image
                                scaledSize: new window.google.maps.Size(5, 5)  // Adjust size as needed
                            }}
                        />
                    )}
                    <CurrentRawPath pathData={currentRawPath} />
                    <SnappedPath pathData={currentSnappedPath} />
                    <PreviousRawPaths refreshFlag={isTracking} />
                </GoogleMap>
                <TrackingControl
                    currentRawPath={currentRawPath}
                    setCurrentRawPath={setCurrentRawPath}
                    currentSnappedPath={currentSnappedPath}
                    setCurrentSnappedPath={setCurrentSnappedPath}
                    isTracking={isTracking}
                    setIsTracking={setIsTracking}
                    setUserLocation={setUserLocation}
                />
                <DownloadRawPathCSV />
                <DownloadSnappedPathCSV />
                <ClearDatabase />
            </div>
        </LoadScript>
    );
}

export default Map;
