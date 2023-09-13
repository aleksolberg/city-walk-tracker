import React from 'react';
import { Polyline } from '@react-google-maps/api';

function RawPath({ pathData }) {
  return pathData.length > 1 ? (
    <Polyline 
      path={pathData} 
      options={{
        strokeColor: "#00FF00",
        strokeOpacity: 0.8,
        strokeWeight: 2,
      }}
    />
  ) : null;
}

export default RawPath;