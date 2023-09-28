import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import TrackingControl from './TrackingControl';
import CurrentRawPath from './mapElements/CurrentRawPath';
import { DownloadRawPaths } from '../../databasePage/elements/DownloadRawPaths';
import { ClearDatabase } from '../../databasePage/elements/ClearDatabase';
import PreviousRawPaths from './mapElements/PreviousRawPaths';
import CurrentOSRMNodes from './mapElements/CurrentOSRMNodes';
import { setCurrentPosition } from '../../../redux/currentPositionSlice';
import { DownloadOsrmNodes } from '../../databasePage/elements/DownloadOsrmNodes';
import PreviousOSRMNodes from './mapElements/PreviousOSRMNodes';

const containerStyle = {
    width: '100vw',
    height: '100vh'
};

function Map() {
    const dispatch = useDispatch();
    const currentPosition = useSelector(state => state.currentPosition.value);

    const [followUser, setFollowUser] = useState(true);

    useEffect(() => {
        if (!("geolocation" in navigator)) {
            console.warn("Geolocation is not supported by this browser.");
            return;
        }

        const watchId = navigator.geolocation.watchPosition(position => {
            const newPoint = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            dispatch(setCurrentPosition(newPoint));

        }, error => {
            console.error("Error while tracking: ", error);
        },
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 5000
            }
        );

        // Clear the watch when the component unmounts.
        return () => navigator.geolocation.clearWatch(watchId);
    }, []);


    return (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <div style={{ position: 'relative' }}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={followUser ? currentPosition : undefined || undefined}
                    zoom={15}
                    onDragStart={() => setFollowUser(false)}
                    clickableIcons={false}
                    options={{
                        mapTypeControl: false,
                        streetViewControl: false,
                        fullscreenControl: false,
                        gestureHandling: "greedy",
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
                    {currentPosition && window.google && (
                        <Marker
                            position={currentPosition}
                            icon={{
                                url: "bluedot.png",
                                scaledSize: new window.google.maps.Size(10, 10)
                            }}
                        />
                    )}
                    <CurrentRawPath />
                    <PreviousRawPaths />
                    <CurrentOSRMNodes />
                    <PreviousOSRMNodes />
                </GoogleMap>
                <TrackingControl />
                <DownloadRawPaths />
                <DownloadOsrmNodes />
                <ClearDatabase />
                <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}>
                    <button onClick={() => setFollowUser(true)}>Follow User</button>
                </div >
            </div>
        </LoadScript>
    );
}

export default Map;
