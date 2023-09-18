import React from 'react';
import { Polyline } from '@react-google-maps/api';

function CurrentOSRMPath({pathData}) {

    return pathData.length > 1 ? (
      <Polyline 
        path={pathData} 
        options={{
          strokeColor: "#FFFFFF",
          strokeOpacity: 0.8,
          strokeWeight: 2,
        }}
      />
    ) : null;
  }

export default CurrentOSRMPath;