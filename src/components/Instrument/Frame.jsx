import PropTypes from "prop-types";
import styles from "./Frame.module.css";

function Frame({ children, customClass }) {
    return (
        <div className={customClass ? `${styles.wrapper} ${customClass}` : styles.wrapper}>
            <div className={styles.screw}>
                <div className={styles.indent}></div>
            </div>
            <div className={styles.screw}>
                <div className={styles.indent}></div>
            </div>
            <div className={styles.screw}>
                <div className={styles.indent}></div>
            </div>
            <div className={styles.screw}>
                <div className={styles.indent}></div>
            </div>
            {children}
        </div>
    );
}

Frame.propTypes = {
    children: PropTypes.node,
    customClass: PropTypes.string
};

export default Frame;