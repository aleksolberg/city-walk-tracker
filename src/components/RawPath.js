import React from 'react';
import { Polyline } from '@react-google-maps/api';

function RawPath({ pathData }) {
  return pathData.length > 1 ? <Polyline path={pathData} /> : null;
}

export default RawPath;