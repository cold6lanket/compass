import PropTypes from "prop-types";
import styles from "./IndicatorRing.module.css";

function IndicatorRing({children, withMarkings = true}) {
    return (
        <div className={styles.content}>
            <div className={styles["needle"]}>
                <div className={styles["outer-needle-face"]}>
                    {withMarkings && (
                        <>
                            <div className={`${styles["marking"]} ${styles["marking-one"]}`}></div>
                            <div className={`${styles["marking"]} ${styles["marking-two"]}`}></div>
                            <div className={`${styles["marking"]} ${styles["marking-three"]}`}></div>
                            <div className={`${styles["marking"]} ${styles["marking-four"]}`}></div>
                            <div className={`${styles["marking"]} ${styles["marking-five"]}`}></div>
                            <div className={`${styles["marking"]} ${styles["marking-six"]}`}></div>
                            <div className={`${styles["marking"]} ${styles["marking-seven"]}`}></div>
                            <div className={`${styles["marking"]} ${styles["marking-eight"]}`}></div>
                        </>
                    )}
                    <div className={styles["inner-face"]}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

IndicatorRing.propTypes = {
    withMarkings: PropTypes.bool,
    children: PropTypes.node
};

export default IndicatorRing;