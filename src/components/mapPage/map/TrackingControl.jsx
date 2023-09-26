import { useState } from 'react';
import { computeDistance } from './MapUtils'
import { saveRawPath, saveSnappedPath } from '../../databasePage/databaseUtils/IndexedDB';
import { snapPointsToRoads } from './lines/linesUtils/RoadSnapping';
import { geolocationThreshold, unsnappedPointsSize } from '../../../config/constants';
import { getNearestRoadNodes } from './lines/linesUtils/OSRM';
import { useDispatch, useSelector } from 'react-redux';
import { setIsTrackingTrue, setIsTrackingFalse } from '../../../redux/isTrackingSlice';
import { addPointToCurrentRawPath, clearCurrentRawPath } from '../../../redux/currentRawPathSlice';
import { addNodeToCurrentNodes, clearCurrentNodes } from '../../../redux/currentNodesSlice';

let watchId = null;
let lastLoggedPoint = null;

function TrackingControl(props) {
  const isTracking = useSelector(state => state.isTracking.value);

  const dispatch = useDispatch();

  const [unsnappedPoints, setUnsnappedPoints] = useState([]);


  function startTracking() {
    if (!("geolocation" in navigator)) {
      console.warn("Geolocation is not supported by this browser.");
      return;
    }

    dispatch(setIsTrackingTrue())

    watchId = navigator.geolocation.watchPosition(position => {
      const newPoint = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      setTimeout(() => {
        props.setUserLocation(newPoint);
        props.setCenter(newPoint);
      }, 0);

      if (lastLoggedPoint === null) { // This is the first point on the path
        setUnsnappedPoints([newPoint]); // Remove?
        dispatch(addPointToCurrentRawPath(newPoint));
        handleNearbyNodes(newPoint);
        lastLoggedPoint = newPoint;
        console.log(lastLoggedPoint)
      } else {
        const distance = computeDistance(lastLoggedPoint.lat, lastLoggedPoint.lng, newPoint.lat, newPoint.lng);
        if (distance > geolocationThreshold) {
          handleNearbyNodes(newPoint);
          setUnsnappedPoints(prevUnsnappedPoints => { // Remove?
            if (prevUnsnappedPoints.length >= unsnappedPointsSize - 1) {
              handleBulkSnapping([...prevUnsnappedPoints, newPoint]);
              return [newPoint]
            } else {
              return [...prevUnsnappedPoints, newPoint];
            }
          })
        }
      }
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
      lastLoggedPoint = null;
      dispatch(setIsTrackingFalse());
      try {
        const sessionId = await saveRawPath(props.currentRawPath);
        await saveSnappedPath(sessionId, finalSnappedPoints);
        console.log('Path saved successfully!');
        dispatch(clearCurrentRawPath());
        dispatch(clearCurrentNodes());
        props.setCurrentSnappedPath([]);
      } catch (error) {
        console.error('Error saving path:', error);
      }
    }
  };

  async function handleNearbyNodes(newPoint) {
    const newNodes = await getNearestRoadNodes(newPoint.lat, newPoint.lng, 3)
    console.log(newNodes)
    if (newNodes.length > 0) {
      newNodes.forEach(element => {
        dispatch(addNodeToCurrentNodes(element));
      });
    }
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
      {!isTracking ? (
        <button onClick={startTracking}>Start Tracking</button>
      ) : (
        <button onClick={stopTracking}>Stop Tracking</button>
      )}
    </div>
  );
}

export default TrackingControl;