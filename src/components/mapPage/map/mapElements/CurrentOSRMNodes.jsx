import React, { useEffect, useState } from 'react';
import { Circle } from '@react-google-maps/api';
import { useSelector } from 'react-redux';
import { getNearestRoadNodes } from './mapUtils/OSRM';
import { saveOsrmNodes } from '../../../databasePage/databaseUtils/IndexedDB';
import { numNearestNodes } from '../../../../config/constants';

function CurrentOSRMNodes() {
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
    console.log(currentNodes)
    if (!isTracking && currentNodes.length > 0) {
      if (sessionId != null) {
        saveOsrmNodes(sessionId, currentNodes);
        console.log(`${currentNodes.length} nodes saved to DB.`)
        setCurrentNodes([]);
      }
    }
  }, [isTracking, sessionId])


  async function handleNearbyNodes(newPoint) {
    const newNodes = await getNearestRoadNodes(newPoint.lat, newPoint.lng, numNearestNodes)
    if (newNodes.length > 0) {
      // Filtering out the duplicates
      const uniqueNewNodes = newNodes.filter(newNode => {
        const newNodeId = `${newNode.lat},${newNode.lng}`;
        return !currentNodes.some(existingNode => `${existingNode.lat},${existingNode.lng}` === newNodeId);
      });
      
      if(uniqueNewNodes.length > 0) setCurrentNodes(prevNodes => [...prevNodes, ...uniqueNewNodes]);
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

export default CurrentOSRMNodes;