import { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from 'prop-types';
import Numpad from "../Numpad";
import AutoPilotDisplay from "../AutoPilotDisplay";
import AutoPilotSettings from "../AutoPilotSettings";
import { 
    randomIntFromInterval, 
    areNumbers, 
    generateRandomNumber,
    countEqualParams 
} from "../../utils";
import { MAX_ALTITUDE, MAX_HEADING, MAX_SPEED } from "../../utils/constants";

function TaskManagerGame({ onFinish }) {
    const [{leftNumPad, rightNumPad}, setNumPad] = useState({
        leftNumPad: undefined, 
        rightNumPad: undefined
    });
    const [key, setKey] = useState(null);
    const [autoPilotSettings, setAutoPilotSettings] = useState({
        altitude: 0,
        heading: 0,
        speed: 0
    });
    const [randomAutoPilotSettings, setRandomAutoPilotSettings] = useState({
        altitude: 0,
        heading: 0,
        speed: 0
    });
    const [isNotify, setIsNotify] = useState(false);
    const [score, setScore] = useState({
        settings: {
            current: 0,
            total: 0
        },
        numpad: {
            current: 0,
            total: 0
        }
    });
    const [isFinished, setIsFinished] = useState(false);

    const timerRef = useRef(null);

    const showNumPad = useCallback(() => {
        const isRightSide = (Math.random() > 0.5) ? 1 : 0;

        const activeCell = randomIntFromInterval(1, 9);

        const numpad = {leftNumPad: undefined, rightNumPad: undefined};

        if (isRightSide) {
            numpad.rightNumPad = activeCell;
        } else {
            numpad.leftNumPad = activeCell;
        }

        setNumPad(numpad);

        setScore(prevScore => {
            return {
                ...prevScore,
                numpad: {
                    current: prevScore.numpad.current,
                    total: prevScore.numpad.total + 1,
                }
            };
        });
    }, []);

    const clearNumPad = () => {
        setNumPad({
            leftNumPad: undefined, 
            rightNumPad: undefined
        });
    };

    const selectedNumpadCell = typeof leftNumPad === "number" ? leftNumPad : rightNumPad;

    if (areNumbers(selectedNumpadCell, key) && selectedNumpadCell === key) {
        clearNumPad();
        setKey(null);
        setScore(prevScore => {
            return {
                ...prevScore,
                numpad: {
                    ...prevScore.numpad,
                    current: prevScore.numpad.current + 1
                }
            };
        });
    } else if (areNumbers(selectedNumpadCell, key) && selectedNumpadCell !== key) {
        clearNumPad();
        setKey(null);
    }

    useEffect(() => {
        let settingTimer;
        let notifyTimer;

        const initSettings = () => {
            const altitude = generateRandomNumber(1000, MAX_ALTITUDE, 500);
            const heading = generateRandomNumber(0, MAX_HEADING, 5);
            const speed = generateRandomNumber(60, MAX_SPEED, 10);
    
            setRandomAutoPilotSettings({altitude, heading, speed});

            setScore(prevScore => {
                return {
                    ...prevScore,
                    settings: {
                        ...prevScore.settings,
                        total: prevScore.settings.total + 3
                    }
                };
            });
        };

        // settings are set
        // 10 sec wait
        // next settings

        initSettings();

        const initTimer = () => {
            setIsNotify(true);

            clearTimeout(settingTimer);
            clearTimeout(notifyTimer);

            notifyTimer = setTimeout(() => {
                setIsNotify(false);
            }, 3000);

            settingTimer = setTimeout(() => {
                initSettings();
                initTimer();
            }, 17_000);
        };

        initTimer();

        return () => {
            clearTimeout(settingTimer);
            clearTimeout(notifyTimer);
        };
    }, []);

    useEffect(() => {

        const initTimer = () => {
            clearTimeout(timerRef.current);

            const ms = randomIntFromInterval(3, 8) * 1000;
    
            timerRef.current = setTimeout(() => {
                showNumPad();
                setTimeout(() => {
                    clearNumPad();
                    if (timerRef.current !== null) {
                        initTimer();
                    }
                }, 3000);
            }, ms);
        };

        initTimer();

        return () => {
            clearTimeout(timerRef.current);
        };
    }, [showNumPad]);

    useEffect(() => {
        const onKeyDown = (e) => {
            const key = Number(e.key);
           
            // Numpad
            if (key > 0 && key <= 9) {
                setKey(key);
            }

            if (isNaN(key)) {
                // arrow left and right for heading
                // arrow up and down for speed
                // plus  and minus for altitude
                switch (e.key) {
                    case "ArrowUp":
                        setAutoPilotSettings( handleSpeedUp );
                        break;
                    case "ArrowDown":
                        setAutoPilotSettings( handleSpeedDown );
                        break;
                    case "ArrowLeft":
                        setAutoPilotSettings( handleHeadingDown );
                        break;
                    case "ArrowRight":
                        setAutoPilotSettings( handleHeadingUp );
                        break;
                    case "+":
                        setAutoPilotSettings( handleAltitudeUp );
                        break;
                    case "-":
                        setAutoPilotSettings( handleAltitudeDown );
                        break;
                    case "Enter": {
                        const count = countEqualParams(autoPilotSettings, randomAutoPilotSettings);
                        setScore(prevScore => {
                            return {
                                ...prevScore,
                                settings: {
                                    ...prevScore.settings,
                                    current: prevScore.settings.current + count
                                }
                            };
                        });
                        break;
                    }
                    default:
                        break;
                }
            }
        };

        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [autoPilotSettings, randomAutoPilotSettings]);

    useEffect(() => {
        setTimeout(() => {
            setIsFinished(true);
        }, 60 * 1000);
    }, []);

    if (isFinished) {
        setIsFinished(false);
        onFinish(score);
    }
  
    return (
        <div>
            <div style={{ position: "absolute", top: "10px", left: 10 }}>
                <Numpad activeIdx={leftNumPad} />
            </div>
            <div style={{ position: "absolute", top: "10px", right: 10 }}>
                <Numpad activeIdx={rightNumPad} />
            </div>
            <div style={{ position: "absolute", bottom: "20px", left: 10 }}>
                <AutoPilotSettings 
                    altitude={autoPilotSettings.altitude} 
                    heading={autoPilotSettings.heading} 
                    speed={autoPilotSettings.speed} 
                />
            </div>
            <div style={{ position: "absolute", bottom: "20px", right: 10 }}>
                <h3 style={{color: "#000"}}>{isNotify ? "New information. Change autopilot to:" : ""}</h3>
                <AutoPilotDisplay 
                    altitude={randomAutoPilotSettings.altitude} 
                    heading={randomAutoPilotSettings.heading} 
                    speed={randomAutoPilotSettings.speed} 
                />
            </div>
        </div>
    );
}
  
export default TaskManagerGame;  

TaskManagerGame.propTypes = {
    onFinish: PropTypes.func,
};

const handleSpeedUp = (settings) => {
    let speed = settings.speed + 10;
    if (speed > MAX_SPEED) {
        speed = MAX_SPEED;
    }
    return {...settings, speed};
};

const handleSpeedDown = (settings) => {
    let speed = settings.speed - 10;
    if (speed <= 0) {
        speed = 0;
    }
    return {...settings, speed};
};

const handleHeadingDown = (settings) => {
    let heading = settings.heading - 5;
    if (heading <= 0) {
        heading = 0;
    }
    return {...settings, heading};
};

const handleHeadingUp = (settings) => {
    let heading = settings.heading + 5;
    if (heading > MAX_HEADING) {
        heading = MAX_HEADING;
    }
    return {...settings, heading};
};

const handleAltitudeUp = (settings) => {
    let altitude = settings.altitude + 500;
    if (altitude > MAX_ALTITUDE) {
        altitude = MAX_ALTITUDE;
    }
    return {...settings, altitude};
};

const handleAltitudeDown = (settings) => {
    let altitude = settings.altitude - 500;
    if (altitude <= 0) {
        altitude = 0;
    }
    return {...settings, altitude};
};