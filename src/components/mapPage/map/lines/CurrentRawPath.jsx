import { Polyline } from '@react-google-maps/api';
import { useSelector } from 'react-redux';


function CurrentRawPath() {
  const currentRawPath = useSelector(state => state.currentRawPath.value);

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