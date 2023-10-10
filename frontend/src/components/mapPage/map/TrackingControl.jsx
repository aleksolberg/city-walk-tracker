import { useEffect } from 'react';
import { computeDistance } from './mapElements/mapUtils/MapUtils'
import { geolocationThreshold } from '../../../config/constants';
import { useDispatch, useSelector } from 'react-redux';
import { setIsTrackingTrue, setIsTrackingFalse } from '../../../redux/isTrackingSlice';
import { setLastLoggedPosition } from '../../../redux/lastLoggedPositionSlice';
import { setSessionId } from '../../../redux/sessionSlice';
import { getAllSessionIds } from '../../databasePage/databaseUtils/IndexedDB';

function TrackingControl(props) {
  const dispatch = useDispatch();

  const isTracking = useSelector(state => state.isTracking.value);
  const lastLoggedPosition = useSelector(state => state.lastLoggedPosition.value);
  const currentPosition = useSelector(state => state.currentPosition.value);

  useEffect(() => {
    if (isTracking) {
      if (lastLoggedPosition === null) {
        dispatch(setLastLoggedPosition(currentPosition));
      } else {
        const distance = computeDistance(lastLoggedPosition.lat, lastLoggedPosition.lng, currentPosition.lat, currentPosition.lng);
        if (distance > geolocationThreshold) {
          dispatch(setLastLoggedPosition(currentPosition));
        }
      }
    }
  }, [currentPosition, isTracking, lastLoggedPosition, dispatch])


  function startTracking() {
    dispatch(setIsTrackingTrue());
    getAllSessionIds().then(ids => {
      const nextSessionId = Math.max(...ids, 0) + 1;
      dispatch(setSessionId(nextSessionId));
  })
    
  }

  function stopTracking() {
    dispatch(setIsTrackingFalse());
  }


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