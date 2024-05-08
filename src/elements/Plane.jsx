import PropTypes from 'prop-types';
import Arrow from './Arrow';
import PlaneImg from "../assets/plane.png";
import styles from "./Plane.module.css";

function Plane({ heading = 0, pitch, bankAngle }) {
    let line;

    if (!pitch && !bankAngle) {
        line = null;
    } else {
        line = <Arrow rotate={getRotation(pitch, bankAngle)} />;
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

function getRotation(pitch, bankAngle) {
    let rotate = 0;

    const bankAngleDeg = {
        "LEFT": 270,
        "RIGHT": 90
    };

    const pitchDeg = {
        "UP": 0,
        "DOWN": 180
    };

    if (pitch === "UP" && bankAngle === "RIGHT") {
        rotate = 45;
    } else if (pitch === "UP" && bankAngle === "LEFT") {
        rotate = 315;
    } else if (pitch === "DOWN" && bankAngle === "RIGHT") {
        rotate = 135;
    } else if (pitch === "DOWN" && bankAngle === "LEFT") {
        rotate = 225;
    } else {
        if (pitch && !bankAngle) {
            rotate = pitchDeg[pitch];
        }
        if (!pitch && bankAngle) {
            rotate = bankAngleDeg[pitch];
        }
    }

    return rotate - 90;
}

Plane.propTypes = {
    heading: PropTypes.number,
    pitch:  PropTypes.oneOf(['UP', 'DOWN', null, undefined]),
    bankAngle: PropTypes.oneOf(['RIGHT', 'LEFT', null, undefined])
};

export default Plane;