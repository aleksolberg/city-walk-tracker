import React, { useEffect, useState } from 'react';
import { Circle } from '@react-google-maps/api';
import { useSelector } from 'react-redux';
import { getNearestRoadNodes } from './linesUtils/OSRM';
import { saveOsrmNodes } from '../../../databasePage/databaseUtils/IndexedDB';

function CurrentOSRMPath() {
  const isTracking = useSelector(state => state.isTracking.value);
  const lastLoggedPosition = useSelector(state => state.lastLoggedPosition.value);
  const sessionId = useSelector(state => state.session.id)

  const [currentNodes, setCurrentNodes] = useState([]);

  useEffect(() => {
    if (lastLoggedPosition != null) {
      handleNearbyNodes(lastLoggedPosition);
    }
  }, [lastLoggedPosition])

  useEffect(() => {
    if (!isTracking && currentNodes.length > 0) {
      if (sessionId != null) {
        saveOsrmNodes(sessionId, currentNodes);
      }
    }
  }, [isTracking, sessionId])

  async function handleNearbyNodes(newPoint) {
    console.log("hhh")
    const newNodes = await getNearestRoadNodes(newPoint.lat, newPoint.lng, 3)
    console.log(newNodes)
    if (newNodes.length > 0) {
      setCurrentNodes(prevNodes => [...prevNodes, ...newNodes]);
    }
  }

  return (
    <>
      {currentNodes.map((node, index) => (
        <Circle
          key={index}
          center={{ lat: node.lat, lng: node.lng }} // Assuming node has lat and lng properties
          radius={3} // You can adjust the radius as needed
          options={{
            fillColor: "rgba(0,0,0,0)",
            fillOpacity: 1,
            strokeColor: "#000000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
          }}
        />
      ))}
    </>
  );
}

export default CurrentOSRMPath;