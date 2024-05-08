import PropTypes from "prop-types";
import Frame from "../Instrument/Frame";
import IndicatorRing from "../IndicatorRing/IndicatorRing";
import Arrow from "../../elements/Arrow";
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
                <Arrow rotate={rotate} color="red" />
            </IndicatorRing>
        </Frame>
    );
}

Compass.propTypes = {
    heading: PropTypes.number
};

export default Compass;