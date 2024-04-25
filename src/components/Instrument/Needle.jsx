import Frame from "./Frame";
import PropTypes from "prop-types";
import styles from "./Needle.module.css";

function Needle({rotate = 0}) {
    return (
        <Frame>
            <div className={styles["content"]}> 
                <div className={styles["needle"]}>
                    <div className={styles["outer-needle-face"]}>
                        <div className={`${styles["marking"]} ${styles["marking-one"]}`}></div>
                        <div className={`${styles["marking"]} ${styles["marking-two"]}`}></div>
                        <div className={`${styles["marking"]} ${styles["marking-three"]}`}></div>
                        <div className={`${styles["marking"]} ${styles["marking-four"]}`}></div>
                        <div className={`${styles["marking"]} ${styles["marking-five"]}`}></div>
                        <div className={`${styles["marking"]} ${styles["marking-six"]}`}></div>
                        <div className={styles["inner-needle-face"]}>
                            <div 
                                style={{ transform: `rotate(${rotate}deg)` }} 
                                className={`${styles["hand"]} ${styles["second-hand"]}`}
                            ></div>
                            <div className={styles["ball"]}></div>
                        </div>
                    </div>
                </div>
            </div>
        </Frame>
    );
}

Needle.propTypes = {
    rotate: PropTypes.number
};

export default Needle;