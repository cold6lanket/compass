import ArtificialHorizon from "../ArtificialHorizon/ArtificialHorizon";
import Compass from "../Compass/Compass";
import PlaneGrid from "../PlaneGrid/PlaneGrid";
import Rbi from "../Rbi/Rbi";
import styles from "./Orientation.module.css";

function Orientation() {
    return (
        <div className={styles.content}>
            <div className={styles.instruments}>
                <Rbi />
                <ArtificialHorizon />
                <Compass />
            </div>
            <PlaneGrid />
        </div>
    );
}

export default Orientation;