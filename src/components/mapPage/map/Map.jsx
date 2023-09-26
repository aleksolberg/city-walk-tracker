import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import TrackingControl from './TrackingControl';
import CurrentRawPath from './lines/CurrentRawPath';
import { DownloadRawPaths } from '../../databasePage/elements/DownloadRawPaths';
import { ClearDatabase } from '../../databasePage/elements/ClearDatabase';
import PreviousRawPaths from './lines/PreviousRawPaths';
import CurrentOSRMPath from './lines/CurrentOSRMPath';
import { setCurrentPosition } from '../../../redux/currentPositionSlice';
import { DownloadOsrmNodes } from '../../databasePage/elements/DownloadOsrmNodes';
//import { parseCSV } from '../../../testing/CSVPathParser';
//import { snapPointsToRoads } from './lines/linesUtils/RoadSnapping';

const containerStyle = {
    width: '100vw',
    height: '100vh'
};

function Map() {
    const dispatch = useDispatch();
    const currentPosition = useSelector(state => state.currentPosition.value);

    //const [center, setCenter] = useState(null);
    //const [currentSnappedPath, setCurrentSnappedPath] = useState([]);
    //const [isTracking, setIsTracking] = useState(false);
    //const [userLocation, setUserLocation] = useState(null);

    /*useEffect(() => {
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
                    center={currentPosition || undefined}
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
                    <CurrentRawPath />
                    <PreviousRawPaths />
                    <CurrentOSRMPath />
                </GoogleMap>
                <TrackingControl />
                <DownloadRawPaths />
                <DownloadOsrmNodes />
                <ClearDatabase />
            </div>
        </LoadScript>
    );
}

export default Map;
