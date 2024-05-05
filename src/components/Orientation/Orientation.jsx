import ArtificialHorizon from "../ArtificialHorizon/ArtificialHorizon";
import Compass from "../Compass/Compass";
import Rbi from "../Rbi/Rbi";
import styles from "./Orientation.module.css";

function Beacon() {
    return (
        <div className={styles.beacon}>
            <div></div>
            <div></div>
        </div>
    );
}

function Orientation() {
    const cells = [];
    const rows = 5;
    const columns = 5;

    for (let i = 0; i < rows * columns; i++) {
        let content = null;

        if (i === 12) {
            content = <Beacon />; 
        } 

        cells.push(<div className={styles.cell}>{content}</div>);
    }

    return (
        <div className={styles.content}>
            <div className={styles.instruments}>
                <Rbi />
                <ArtificialHorizon />
                <Compass />
            </div>
            <div className={styles.grid}>
                {cells}
            </div>
        </div>
    );
}

export default Orientation;