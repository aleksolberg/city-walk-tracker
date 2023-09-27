import { Polyline } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { saveRawPath } from '../../../databasePage/databaseUtils/IndexedDB';


function CurrentRawPath() {

  const isTracking = useSelector(state => state.isTracking.value);
  const lastLoggedPosition = useSelector(state => state.lastLoggedPosition.value);
  const sessionId = useSelector(state => state.session.id);

  const [currentRawPath, setCurrentRawPath] = useState([]);


  useEffect(() => {
    if (lastLoggedPosition != null) {
      setCurrentRawPath(prevPath => [...prevPath, lastLoggedPosition])
    }
  }, [lastLoggedPosition])


  useEffect(() => {
    if (!isTracking && currentRawPath.length > 0) {
      saveRawPath(sessionId, currentRawPath);
      setCurrentRawPath([]);
    }
  }, [isTracking])

  return currentRawPath.length > 0 ? (
    <Polyline
      path={currentRawPath}
      options={{
        strokeColor: "#00FF00",
        strokeOpacity: 0.8,
        strokeWeight: 2,
      }}
    />
  ) : null;
}

export default CurrentRawPath;