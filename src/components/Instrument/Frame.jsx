import PropTypes from "prop-types";
import styles from "./Frame.module.css";

function Frame({ children }) {
    return (
        <div className={styles.wrapper}>
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
            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
}

Frame.propTypes = {
    children: PropTypes.node
};

export default Frame;