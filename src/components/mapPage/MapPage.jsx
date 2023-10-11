import { ClearDatabase } from '../pathDatabase/elements/ClearDatabase';
import { DownloadOsrmNodes } from '../pathDatabase/elements/DownloadOsrmNodes';
import { DownloadRawPaths } from '../pathDatabase/elements/DownloadRawPaths';
import FollowUserButton from './FollowUserButton';
import Map from './map/Map'
import TrackingControl from './TrackingControl';
import StatisticsButton from './StatisticsButton';
import './MapPage.css'

function MapPage() {
    return (
        <div>
            <Map />
            <TrackingControl />
            <DownloadRawPaths />
            <DownloadOsrmNodes />
            <ClearDatabase />
            <FollowUserButton/>
            <StatisticsButton/>
        </div>
    )
}

export default MapPage;