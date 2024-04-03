import PropTypes from 'prop-types';
import styles from "./AutoPilotDisplay.module.css";

function AutoPilotDisplay({ altitude, heading, speed }) {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.innerContent}>
                    <div className={styles.parameter}>
                        <div className={styles.parameterName}>
                            <p>Altitude</p>
                        </div>
                        <div className={styles.parameterBox}>
                            {altitude}
                        </div>
                    </div>
                    <div className={styles.parameter}>
                        <div className={styles.parameterName}>
                            <p>Heading</p>
                        </div>
                        <div className={styles.parameterBox}>
                            {heading}
                        </div>
                    </div>
                    <div className={styles.parameter}>
                        <div className={styles.parameterName}>
                            <p>Speed</p>
                        </div>
                        <div className={styles.parameterBox}>
                            {speed}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

AutoPilotDisplay.propTypes = {
    altitude: PropTypes.number.isRequired,
    heading: PropTypes.number.isRequired,
    speed: PropTypes.number.isRequired,
};

export default AutoPilotDisplay;