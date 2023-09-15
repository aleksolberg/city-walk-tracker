import React from 'react';
import { Polyline } from '@react-google-maps/api';

function CurrentSnappedPath(props) {

    return props.pathData.length > 1 ? (
      <Polyline 
        path={props.pathData} 
        options={{
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
        }}
      />
    ) : null;
  }

export default CurrentSnappedPath;