import { Polyline } from '@react-google-maps/api';


function CurrentRawPath(props) {

  return props.pathData.length > 0 ? (
    <Polyline
      path={props.pathData}
      options={{
        strokeColor: "#00FF00",
        strokeOpacity: 0.8,
        strokeWeight: 2,
      }}
    />
  ) : null;
}

export default CurrentRawPath;