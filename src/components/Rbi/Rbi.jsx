import PropTypes from "prop-types";
import Frame from "../Instrument/Frame";
import IndicatorRing from "../IndicatorRing/IndicatorRing";
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
                <div style={{rotate: `${rotate}deg`}} className={styles.line}></div>
            </IndicatorRing>
        </Frame>
    );
}

Rbi.propTypes = {
    beaconPoint: PropTypes.number
};

export default Rbi;