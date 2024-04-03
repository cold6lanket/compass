import PropTypes from 'prop-types';
import styles from "./AutoPilotSettings.module.css";

function AutoPilotSettings({ altitude, heading, speed }) {
    // TODO. style parameterBox digits
    return (
        <div className={styles.container}>
            <div className={styles.content}>
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
    );
}

AutoPilotSettings.propTypes = {
    altitude: PropTypes.number.isRequired,
    heading: PropTypes.number.isRequired,
    speed: PropTypes.number.isRequired,
};

export default AutoPilotSettings;
