import { useState, useEffect, useRef } from "react";
import Numpad from "../../components/Numpad";
import AutoPilotDisplay from "../../components/AutoPilotDisplay";
import AutoPilotSettings from "../../components/AutoPilotSettings";
import { randomIntFromInterval, areNumbers, generateRandomNumber } from "../../utils";

const MAX_ALTITUDE = 33000;
const MAX_HEADING = 360;
const MAX_SPEED = 330;

function TaskManager() {
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
    const timerRef = useRef(null);

    const showNumPad = () => {
        const isRightSide = (Math.random() > 0.5) ? 1 : 0;

        const activeCell = randomIntFromInterval(1, 9);

        const numpad = {leftNumPad: undefined, rightNumPad: undefined};

        if (isRightSide) {
            numpad.rightNumPad = activeCell;
        } else {
            numpad.leftNumPad = activeCell;
        }

        setNumPad(numpad);
    };

    const clearNumPad = () => {
        setNumPad({
            leftNumPad: undefined, 
            rightNumPad: undefined
        });
    };

    const selectedNumpadCell = typeof leftNumPad === "number" ? leftNumPad : rightNumPad;

    if (areNumbers(selectedNumpadCell, key) && selectedNumpadCell === key) {
        console.log("Bingo...");
        clearNumPad();
        setKey(null);
    } else if (areNumbers(selectedNumpadCell, key) && selectedNumpadCell !== key) {
        console.log("Nope!");
        clearNumPad();
        setKey(null);
    }

    useEffect(() => {
        let timerId;

        const initSettings = () => {
            const altitude = generateRandomNumber(1000, MAX_ALTITUDE, 500);
            const heading = generateRandomNumber(0, MAX_HEADING, 5);
            const speed = generateRandomNumber(60, MAX_SPEED, 10);
    
            setRandomAutoPilotSettings({altitude, heading, speed});
        };

        // settings are set
        // 10 sec wait
        // next settings

        initSettings();

        const initTimer = () => {
            clearTimeout(timerId);

            timerId = setTimeout(() => {
                initSettings();
                initTimer();
            }, 17_000);
        };

        initTimer();

        return () => {
            clearTimeout(timerId);
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
    }, []);

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
                    case "Enter":
                        break;
                    default:
                        break;
                }
            }
        };

        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
    }, []);

  
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
                <AutoPilotDisplay 
                    altitude={randomAutoPilotSettings.altitude} 
                    heading={randomAutoPilotSettings.heading} 
                    speed={randomAutoPilotSettings.speed} 
                />
            </div>
        </div>
    );
}
  
export default TaskManager;  

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