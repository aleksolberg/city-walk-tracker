import './StatisticsOverlay.css';

function StatisticsOverlay({ open, children, onClose }) {
    if (!open) return null;

    return (
        <>
            <div className='overlay' onClick={onClose} />
            <div className='modal'>{children}</div>
        </>
    );
}

export default StatisticsOverlay;