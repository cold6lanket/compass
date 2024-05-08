import PropTypes from "prop-types";
import styles from "./Arrow.module.css";

function Arrow({color = "blue", rotate}) {
    let className = styles.arrow;
    if (color === "blue") {
        className = `${styles.blue} ${className}`;
    }
    return (
        <div style={{rotate: `${rotate}deg`}} className={className}></div>
    );
}

Arrow.propTypes = {
    color: PropTypes.string,
    rotate: PropTypes.number
};

export default Arrow;