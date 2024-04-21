import styles from "./Wrapper.module.css";

function Wrapper() {
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
        </div>
    );
}

export default Wrapper;