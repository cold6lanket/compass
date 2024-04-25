import Frame from "./Frame";
import PropTypes from "prop-types";
import styles from "./SlipBall.module.css";

function SlipBall({ ballX = 30 }) {
    return (
        <Frame customClass={styles.slip}>
            <div className={styles.bar}>
                <div className={styles.line}></div>
                <div className={styles.static_ball}></div>
                <div style={{ left: `${ballX}px` }} className={styles.ball}></div>
            </div>
        </Frame>
    );
}

SlipBall.propTypes = {
    ballX: PropTypes.number
};

export default SlipBall;