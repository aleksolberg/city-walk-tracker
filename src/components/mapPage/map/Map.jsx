import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import CurrentRawPath from './mapElements/CurrentRawPath';
import PreviousRawPaths from './mapElements/PreviousRawPaths';
import CurrentOSRMNodes from './mapElements/CurrentOSRMNodes';
import { setCurrentPosition } from '../../../redux/currentPositionSlice';
import PreviousOSRMNodes from './mapElements/PreviousOSRMNodes';
import { setIsFollowingUserFalse } from '../../../redux/isFollowingUserSlice';

const containerStyle = {
    width: '100vw',
    height: '100vh'
};

function Map() {
    const dispatch = useDispatch();
    const currentPosition = useSelector(state => state.currentPosition.value);
    const isFollowingUser = useSelector(state => state.isFollowingUser.value);

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
                    center={isFollowingUser ? currentPosition : undefined || undefined}
                    zoom={15}
                    onDragStart={() => {
                        if (isFollowingUser) {
                            dispatch(setIsFollowingUserFalse())
                        }
                    }}
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
            </div>
        </LoadScript>

    );
}

export default Map;
