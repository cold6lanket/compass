import { useState, useEffect, useRef } from 'react';
import PropTypes from "prop-types";

const Timer = ({
    initialHours = 0,
    initialMinutes = 0,
    initialSeconds = 0,
    onTimerUp
}) => {
    const [time, setTime] = useState({
        h: initialHours,
        m: initialMinutes,
        s: initialSeconds,
    });
    const timerRef = useRef(null);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setTime((time) => {
                const updatedTime = { ...time };
                if (time.s > 0) {
                    updatedTime.s--;
                }

                if (time.s === 0) {
                    if (time.h === 0 && time.m === 0) {
                        onTimerUp?.();
                        clearInterval(timerRef.current);
                    } else if (time.m > 0) {
                        updatedTime.m--;
                        updatedTime.s = 59;
                    } else if (updatedTime.h > 0) {
                        updatedTime.h--;
                        updatedTime.m = 59;
                        updatedTime.s = 59;
                    }
                }

                return updatedTime;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [onTimerUp]);

    return (
        <div>
            <h1>
                {time.h < 10 && time.h !== 0
                    ? `0${time.h}:`
                    : time.h >= 10 && `${time.h}:`}
                {time.m < 10 ? `0${time.m}` : time.m}:
                {time.s < 10 ? `0${time.s}` : time.s}
            </h1>
        </div>
    );
};

Timer.propTypes = {
    initialHours: PropTypes.number,
    initialMinutes: PropTypes.number,
    initialSeconds: PropTypes.number,
    onTimerUp: PropTypes.func
};

export default Timer;