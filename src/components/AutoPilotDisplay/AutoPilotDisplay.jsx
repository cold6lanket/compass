import { useEffect, useRef } from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
import { formatDigits } from '../../utils';
import styles from "./AutoPilotDisplay.module.css";

const inputStyle = {
    color: "#fff", 
    width: "100px", 
    fontWeight: "bold"
};

function AutoPilotDisplay({ 
    altitude, 
    heading, 
    speed, 
    editable = false,
    onChange
}) {
    const altitudeRef = useRef(null);
    const headingRef = useRef(null);
    const speedRef = useRef(null);

    useEffect(() => {
        // TODO.
        // This might not be the best solution for focusing on first input during initial render
        if (editable && !altitude) {
            altitudeRef?.current?.focus();
        }
    }, [editable, altitude]);

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.innerContent}>
                    <div className={styles.parameter}>
                        <div className={styles.parameterName}>
                            <p>Altitude</p>
                        </div>
                        <div className={styles.parameterBox}>
                            {editable ? (
                                <Input 
                                    ref={altitudeRef}
                                    onChange={({target}) => onChange({altitude: target.value})} 
                                    onPressEnter={() => headingRef.current.focus()}
                                    value={altitude} 
                                    style={inputStyle} 
                                    variant="borderless" 
                                />
                            ) : altitude}
                        </div>
                    </div>
                    <div className={styles.parameter}>
                        <div className={styles.parameterName}>
                            <p>Heading</p>
                        </div>
                        <div className={styles.parameterBox}>
                            {editable ? (
                                <Input
                                    ref={headingRef}
                                    onChange={({target}) => onChange({heading: target.value})}
                                    onPressEnter={() => speedRef.current.focus()}  
                                    value={heading} 
                                    style={inputStyle} 
                                    variant="borderless" 
                                />
                            ) : formatDigits(heading)}
                        </div>
                    </div>
                    <div className={styles.parameter}>
                        <div className={styles.parameterName}>
                            <p>Speed</p>
                        </div>
                        <div className={styles.parameterBox}>
                            {editable ? (
                                <Input 
                                    ref={speedRef}
                                    onChange={({target}) => onChange({speed: target.value})} 
                                    value={speed} 
                                    style={inputStyle} 
                                    variant="borderless" 
                                />
                            ) : formatDigits(speed)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

AutoPilotDisplay.propTypes = {
    altitude: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    heading: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    speed: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    editable: PropTypes.bool,
    onChange: function(props, propName) {
        if ((props['editable'] == true && (props[propName] == undefined || typeof(props[propName]) != 'function'))) {
            return new Error('Please provide a onChange function!');
        }
    }
};

export default AutoPilotDisplay;