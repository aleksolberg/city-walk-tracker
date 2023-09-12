import React from 'react';
import { Polyline } from '@react-google-maps/api';

function UserPath({ pathData }) {
  return pathData.length > 1 ? <Polyline path={pathData} /> : null;
}

export default UserPath;