import PropTypes from 'prop-types';
import styles from "./Plane.module.css";
import PlaneImg from "../assets/plane.png";

function Plane({ heading = 0, pitch, bankAngle }) {
    let line;

    if (!pitch && !bankAngle) {
        line = null;
    } else {
        const lineRotation = `${ pitch2style(pitch) } ${ bankangle2style(bankAngle) }`;
        line = <div className={`${styles.line} ${lineRotation}`}></div>;
    }

    return (
        <div className={styles.planeWrapper}>
            <img 
                style={{rotate: `${heading}deg`}} 
                src={PlaneImg} 
                className={styles.plane}
            ></img>
            {line}
        </div>
    );
}

function pitch2style(pitch) {
    const styleMapping = {
        "UP": styles.up,
        "DOWN": styles.down
    };

    return styleMapping[pitch] ?? "";
}

function bankangle2style(bankAngle) {
    const styleMapping = {
        "LEFT": styles.left,
        "RIGHT": styles.right
    };

    return styleMapping[bankAngle] ?? "";
}

Plane.propTypes = {
    heading: PropTypes.number,
    pitch:  PropTypes.oneOf(['UP', 'DOWN', null, undefined]),
    bankAngle: PropTypes.oneOf(['RIGHT', 'LEFT', null, undefined])
};

export default Plane;