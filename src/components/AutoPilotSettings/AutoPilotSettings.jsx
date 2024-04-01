import styles from "./AutoPilotSettings.module.css";

// eslint-disable-next-line react/prop-types
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

export default AutoPilotSettings;
