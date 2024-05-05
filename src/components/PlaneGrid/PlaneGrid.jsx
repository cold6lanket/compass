import PropTypes from 'prop-types';
import styles from "./PlaneGrid.module.css";

function PlaneGrid({fillCells = {}}) {
    const cells = [];
    const rows = 5;
    const columns = 5;

    for (let i = 0; i < rows * columns; i++) {
        let content;

        if (i === 12) {
            content = <Beacon />; 
        } else {
            content = fillCells[i] ?? null;
        }

        cells.push(<div key={`${i}`} className={styles.cell}>{content}</div>);
    }

    return (
        <div className={styles.grid}>
            {cells}
        </div>
    );
}

function Beacon() {
    return (
        <div className={styles.beacon}>
            <div></div>
            <div></div>
        </div>
    );
}

PlaneGrid.propTypes = {
    fillCells: PropTypes.object
};

export default PlaneGrid;