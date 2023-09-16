import React from 'react';
import { Polyline } from '@react-google-maps/api';

function CurrentSnappedPath({pathData}) {

    return pathData.length > 1 ? (
      <Polyline 
        path={pathData} 
        options={{
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
        }}
      />
    ) : null;
  }

export default CurrentSnappedPath;