// src/components/MyMap.js

import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import TrackingControl from './TrackingControl';
import CurrentPath from './CurrentPath';

const containerStyle = {
  width: '100vw',
  height: '100vh'
};

let watchId = null;

function Map() {
  const [center, setCenter] = useState(null);  // start with no center until fetched
  const [isTracking, setIsTracking] = useState(false);
  const [pathData, setPathData] = useState([]);

  useEffect(() => {
    // Fetch initial geolocation
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        function(error) {
          console.error("Error obtaining geolocation: ", error);
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
    }
  }, []);

  const startTracking = () => {
    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        function(position) {
          setPathData(prevPath => [...prevPath, {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }]);
        },
        function(error) {
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

  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setIsTracking(false);
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <div style={{ position: 'relative' }}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center || undefined}
          zoom={15}
        >
          <CurrentPath pathData={pathData} />
        </GoogleMap>
        <TrackingControl
          isTracking={isTracking}
          startTracking={startTracking}
          stopTracking={stopTracking}
        />
      </div>
    </LoadScript>
  );
}

export default Map;
