import React from 'react';
import { Polyline } from '@react-google-maps/api';
import { useSelector } from 'react-redux';

function CurrentOSRMPath() {
  const currentNodes = useSelector(store => store.currentNodes.value);

  return currentNodes.length > 1 ? (
    <Polyline
      path={currentNodes}
      options={{
        strokeColor: "#000000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
      }}
    />
  ) : null;
}

export default CurrentOSRMPath;