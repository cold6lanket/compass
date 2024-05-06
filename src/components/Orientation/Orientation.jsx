import Plane from "../../elements/Plane";
import ArtificialHorizon from "../ArtificialHorizon/ArtificialHorizon";
import Compass from "../Compass/Compass";
import PlaneGrid from "../PlaneGrid/PlaneGrid";
import Rbi from "../Rbi/Rbi";
import styles from "./Orientation.module.css";

function Orientation() {
    const fillCells = { 
        5: <Plane />, 
        18: <Plane heading={180} pitch={"DOWN"} bankAngle="LEFT" />,
        24: <Plane heading={270} />
    };

    return (
        <div className={styles.content}>
            <div className={styles.instruments}>
                <Rbi />
                <ArtificialHorizon />
                <Compass />
            </div>
            <PlaneGrid fillCells={fillCells} />
        </div>
    );
}

export default Orientation;