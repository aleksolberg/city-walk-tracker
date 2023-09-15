import { useState } from 'react';
import { computeDistance } from './MapUtils'
import { saveRawPath, saveRoadSegments } from '../../databasePage/databaseUtils/IndexedDB';
import { snapPointsToRoads } from './lines/linesUtils/RoadSnapping';

const currentRoadSegments = new Set();
const geolocationThreshold = 10;
const unsnappedPointsSize = 50;
let watchId = null;

function TrackingControl(props) {
  const [unsnappedPoints, setUnsnappedPoints] = useState([]);

  function startTracking() {
    if (!("geolocation" in navigator)) {
      console.warn("Geolocation is not supported by this browser.");
      return
    }

    props.setIsTracking(true);

    watchId = navigator.geolocation.watchPosition(position => {
      const newPoint = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      props.setCurrentRawPath(prevPoints => {
        if (prevPoints.length <= 0) {
          return [newPoint];
        }

        const previousPoint = prevPoints[prevPoints.length - 1];
        const distance = computeDistance(previousPoint.lat, previousPoint.lng, newPoint.lat, newPoint.lng);

        if (distance > geolocationThreshold) {
          if (unsnappedPoints.length >= unsnappedPointsSize - 1) {
            handleBulkSnapping([...unsnappedPoints, newPoint]);
            setUnsnappedPoints([newPoint]);
          }
          return [...prevPoints, newPoint];
        } else {
          return prevPoints;
        }
      })
    }, error => {
      console.error("Error while tracking: ", error);
    },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
      }
    )
  }

  async function stopTracking() {
    if (unsnappedPoints.length > 1) {
      await handleBulkSnapping(unsnappedPoints);
      setUnsnappedPoints([]);
    }
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      props.setIsTracking(false);
      try {
        const sessionId = await saveRawPath(props.currentRawPath);
        await saveRoadSegments(sessionId, currentRoadSegments);
        console.log('Path saved successfully!');
        props.setCurrentRawPath([])
      } catch (error) {
        console.error('Error saving path:', error);
      }
    }
  };

  async function handleBulkSnapping(points) {
    try {
      const snappedPoints = await snapPointsToRoads(points);
      props.setCurrentSnappedPath(prevSnappedPath => [...prevSnappedPath, ...snappedPoints.map(point => ({
        lat: point.location.latitude,
        lng: point.location.longitude
      }))]);
      currentRoadSegments.add(...snappedPoints.map(point => point.placeId))
    } catch (error) {
      console.error("Error snapping to roads:", error);
    }
  };

  return (
    <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}>
      {!props.isTracking ? (
        <button onClick={startTracking}>Start Tracking</button>
      ) : (
        <button onClick={stopTracking}>Stop Tracking</button>
      )}
    </div>
  );
}

export default TrackingControl;