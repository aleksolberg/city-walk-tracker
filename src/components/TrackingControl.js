import React from 'react';

function TrackingControl({ isTracking, startTracking, stopTracking }) {
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