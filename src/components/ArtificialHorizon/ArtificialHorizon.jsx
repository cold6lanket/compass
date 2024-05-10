import PropTypes from "prop-types";
import Frame from "../Instrument/Frame";
import IndicatorRing from "../IndicatorRing/IndicatorRing";
import styles from "./ArtificialHorizon.module.css";

function ArtificialHorizon({pitch, bankAngle}) {
    return (
        <Frame customClass={styles.content}>
            <IndicatorRing withMarkings={false}>
                <div className={styles.wrapper}>
                    <div className={`${styles.horizon} ${ pitch2style(pitch) } ${ bankangle2style(bankAngle) }`}>
                        <div className={styles.sky}></div>
                        <div className={styles.ground}></div>
                    </div>
                    <div className={styles.center}></div>
                </div>
            </IndicatorRing>
        </Frame>
    );
}

function pitch2style(pitch) {
    const styleMapping = {
        "UP": styles.up,
        "DOWN": styles.down
    };

    return styleMapping[pitch] ?? "";
}

function bankangle2style(turn) {
    const styleMapping = {
        "LEFT": styles.left,
        "RIGHT": styles.right
    };

    return styleMapping[turn] ?? "";
}

ArtificialHorizon.propTypes = {
    pitch: PropTypes.oneOf(['UP', 'DOWN', 'NEUTRAL']),
    bankAngle: PropTypes.oneOf(['LEFT', 'RIGHT', 'NEUTRAL'])
};

export default ArtificialHorizon;