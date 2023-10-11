import { useState } from "react";
import StatisticsOverlay from "./statistics/StatisticsOverlay";
import './MapPage.css'
import Statistics from "./statistics/Statistics";

function StatisticsButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            <button className="statistics" onClick={() => setIsModalOpen(true)}>
                Statistics!
            </button>

            <StatisticsOverlay open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Statistics/>
                <button onClick={() => setIsModalOpen(false)}>Close</button>
            </StatisticsOverlay>
        </div>
    );
}

export default StatisticsButton;