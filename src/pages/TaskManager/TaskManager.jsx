import { useState, useEffect, useRef, useCallback } from "react";
import Numpad from "../../components/Numpad";
import AutoPilotDisplay from "../../components/AutoPilotDisplay";
import AutoPilotSettings from "../../components/AutoPilotSettings";

function TaskManager() {
    const [rightNumPad, setRightNumPad] = useState(undefined);
    const [leftNumPad, setLeftNumPad] = useState(undefined);
    const [key, setKey] = useState(null);
    const timerRef = useRef(null);

    const showNumPad = () => {
        const isRightSide = (Math.random() > 0.5) ? 1 : 0;

        const active = randomIntFromInterval(1, 9);

        if (isRightSide) {
            setRightNumPad(active);
            setLeftNumPad(undefined);
        } else {
            setLeftNumPad(active);
            setRightNumPad(undefined);
        }
    };

    const clearNumPad = () => {
        setLeftNumPad(undefined);
        setRightNumPad(undefined);
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


    const onKeyDown = useCallback((e) => {
        const key = Number(e.key);
       
        // Numpad
        if (key > 0 && key <= 9) {
            setKey(key);
        }
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
        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [onKeyDown]);


  
    return (
        <div>
            <div style={{ position: "absolute", top: "10px", left: 10 }}>
                <Numpad activeIdx={leftNumPad} />
            </div>
            <div style={{ position: "absolute", top: "10px", right: 10 }}>
                <Numpad activeIdx={rightNumPad} />
            </div>
            <div style={{ position: "absolute", bottom: "20px", left: 10 }}>
                <AutoPilotSettings altitude={5000} heading={120} speed={100} />
            </div>
            <div style={{ position: "absolute", bottom: "20px", right: 10 }}>
                <AutoPilotDisplay altitude={12000} heading={20} speed={300} />
            </div>
        </div>
    );
  }
  
  export default TaskManager;

const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

const areNumbers = (num1, num2) => {
    return typeof num1 === "number" && typeof num2 === "number";
};