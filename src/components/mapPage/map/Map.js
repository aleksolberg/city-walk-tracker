import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import TrackingControl from './TrackingControl';
import CurrentRawPath from './lines/CurrentRawPath';
import SnappedPath from './lines/SnappedPath';
import { DownloadCSV } from '../../databasePage/elements/DownloadCSV';
import { ClearDatabase } from '../../databasePage/elements/ClearDatabase';
import PreviousRawPaths from './lines/PreviousRawPaths';

const containerStyle = {
    width: '100vw',
    height: '100vh'
};

function Map() {
    const [center, setCenter] = useState(null);
    const [currentSnappedPath, setCurrentSnappedPath] = useState([]);
    const [currentRawPath, setCurrentRawPath] = useState([]);

    useEffect(() => {
        console.log('currentRawPath updated:', currentRawPath);
    }, [currentRawPath]);

    // Fetch initial location and set center
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                setCenter({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
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
                    <CurrentRawPath pathData={currentRawPath} />
                    <SnappedPath pathData={currentSnappedPath} />
                    <PreviousRawPaths />
                </GoogleMap>
                <TrackingControl
                    currentRawPath={currentRawPath}
                    setCurrentRawPath={setCurrentRawPath}
                    setCurrentSnappedPath={setCurrentSnappedPath}
                />
                <DownloadCSV />
                <ClearDatabase />
            </div>
        </LoadScript>
    );
}

export default Map;
