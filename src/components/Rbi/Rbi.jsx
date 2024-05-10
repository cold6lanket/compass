import PropTypes from "prop-types";
import Frame from "../Instrument/Frame";
import IndicatorRing from "../IndicatorRing/IndicatorRing";
import Arrow from "../../elements/Arrow";
import styles from "./Rbi.module.css";

function Rbi({beaconPoint = 45}) {
    const rotate = beaconPoint - 90;
    return (
        <Frame customClass={styles.content}>
            <IndicatorRing>
                <div className={styles.plane}>
                    <div className={styles.wing}></div>
                    <div className={styles.tail}></div>
                </div>
                <Arrow rotate={rotate} color="red" />
            </IndicatorRing>
        </Frame>
    );
}

Rbi.propTypes = {
    beaconPoint: PropTypes.number
};

export default Rbi;