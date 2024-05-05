import PropTypes from "prop-types";
import Frame from "../Instrument/Frame";
import IndicatorRing from "../IndicatorRing/IndicatorRing";
import styles from "./Compass.module.css";

function Compass({heading = 270}) {
    const rotate = heading - 90;
    return (
        <Frame customClass={styles.compass}>
            <IndicatorRing>
                <div className={`${styles.directions} ${styles.west}`}>W</div>
                <div className={`${styles.directions} ${styles.north}`}>N</div>
                <div className={`${styles.directions} ${styles.east}`}>E</div>
                <div className={`${styles.directions} ${styles.south}`}>S</div>
                <div style={{rotate: `${rotate}deg`}} className={styles.line}></div>
            </IndicatorRing>
        </Frame>
    );
}

Compass.propTypes = {
    heading: PropTypes.number
};

export default Compass;