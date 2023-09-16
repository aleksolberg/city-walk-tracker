import { Polyline } from '@react-google-maps/api';


function CurrentRawPath({pathData}) {

  return pathData.length > 0 ? (
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

export default CurrentRawPath;