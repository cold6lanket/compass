import { useState, useEffect, useRef } from 'react';
import { Typography } from 'antd';
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
    const [isExpired, setIsExpired] = useState(false);
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
                        setIsExpired(true);
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
    }, []);

    useEffect(() => {
        if (isExpired) {
            onTimerUp?.();
        }
    }, [isExpired, onTimerUp]);

    return (
        <div style={{
            backgroundColor: "#FFFD14", 
            width: "70px",
            textAlign: "center",
            border: "1px solid"
        }}>
            <Typography.Title style={{ margin: 0 }} level={4}>
                {time.h < 10 && time.h !== 0
                    ? `0${time.h}:`
                    : time.h >= 10 && `${time.h}:`}
                {time.m < 10 ? `0${time.m}` : time.m}:
                {time.s < 10 ? `0${time.s}` : time.s}
            </Typography.Title>
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