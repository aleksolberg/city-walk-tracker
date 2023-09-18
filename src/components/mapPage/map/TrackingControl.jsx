import { useState } from 'react';
import { computeDistance } from './MapUtils'
import { saveRawPath, saveSnappedPath } from '../../databasePage/databaseUtils/IndexedDB';
import { snapPointsToRoads } from './lines/linesUtils/RoadSnapping';
import { geolocationThreshold, unsnappedPointsSize } from '../../../config/constants';
import { getNearestRoadNodes } from './lines/linesUtils/OSRM';

let watchId = null;

function TrackingControl(props) {
  const [unsnappedPoints, setUnsnappedPoints] = useState([]);


  function startTracking() {
    if (!("geolocation" in navigator)) {
      console.warn("Geolocation is not supported by this browser.");
      return;
    }

    props.setIsTracking(true);

    watchId = navigator.geolocation.watchPosition(position => {
      const newPoint = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      console.log(newPoint)

      setTimeout(() => {
        props.setUserLocation(newPoint);
        props.setCenter(newPoint);
    }, 0);

      props.setCurrentRawPath(prevPoints => {
        if (prevPoints.length < 1) {
          setUnsnappedPoints([newPoint]);
          return [newPoint];
        }

        const previousPoint = prevPoints[prevPoints.length - 1];
        const distance = computeDistance(previousPoint.lat, previousPoint.lng, newPoint.lat, newPoint.lng);

        if (distance > geolocationThreshold) {
          handleNodes(newPoint);
          setUnsnappedPoints(prevUnsnappedPoints => {
            console.log(prevUnsnappedPoints)
            if (prevUnsnappedPoints.length >= unsnappedPointsSize - 1){
              handleBulkSnapping([...prevUnsnappedPoints, newPoint]);
              return [newPoint]
            } else {
              return [...prevUnsnappedPoints, newPoint];
            }
          })
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
    let finalSnappedPoints = props.currentSnappedPath;

    if (unsnappedPoints.length > 1) {
        const snappedPoints = await handleBulkSnapping(unsnappedPoints);
        finalSnappedPoints = [...finalSnappedPoints, ...snappedPoints];
        setUnsnappedPoints([]);
    }
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      props.setIsTracking(false);
      try {
        const sessionId = await saveRawPath(props.currentRawPath);
        await saveSnappedPath(sessionId, finalSnappedPoints);
        console.log('Path saved successfully!');
        props.setCurrentRawPath([]);
        props.setCurrentSnappedPath([]);
      } catch (error) {
        console.error('Error saving path:', error);
      }
    }
  };

  async function handleNodes(newPoint) {
    const newNodes = await getNearestRoadNodes(newPoint.lat, newPoint.lng, 3)
    console.log(newNodes)
    props.setNearestNodes(nearestNodes => nearestNodes.add(newNodes));
  }


  async function handleBulkSnapping(points) {
    try {
        const snappedPoints = await snapPointsToRoads(points);
        props.setCurrentSnappedPath(prevSnappedPath => [...prevSnappedPath, ...snappedPoints.map(point => ({
            lat: point.location.latitude,
            lng: point.location.longitude,
            placeId: point.placeId
        }))]);

        return snappedPoints;
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