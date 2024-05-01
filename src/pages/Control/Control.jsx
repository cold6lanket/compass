import { useState, useRef, useEffect, useCallback } from "react";
import SlipBall from "../../components/Instrument/SlipBall";
import Needle from "../../components/Instrument/Needle";
import { generateRandomNumber } from "../../utils";

function Control() {
    const [ballX, setBallX] = useState(280);
    const [needle, setNeedle] = useState(0);

    const [isBallRunning, setIsBallRunning] = useState(false);
    const [isNeedleRunning, setIsNeedleRunning] = useState(false);

    const [moveNeedle, setMoveNeedle] = useState(30);
    const [moveBall, setMoveBall] = useState(0);

    // const rTimer = useRef(null);

    const getNextTarget = useCallback((min, max, step) => {
        let target = generateRandomNumber(min, max, step);

        const plusOrMinus = Math.random() < 0.5 ? -1 : 1;

        target *= plusOrMinus;

        return target;
    }, []);

    useEffect(() => {
        const tId = setInterval(() => {
            const nextNeedle = getNextTarget(10, 90, 5);
            const nextBall = getNextTarget(0, 250, 10);

            setMoveNeedle(nextNeedle);
            setMoveBall(Math.abs(nextBall));
        }, 5000);

        return () => {
            clearInterval(tId);
        };
    }, [getNextTarget]);

    useEffect(() => {
        if (isNeedleRunning) {
            // user is moving needle, no need to change needle until user stops moving
            return;
        }

        let step = 1;
        let nId, delay; 

        delay = setTimeout(() => {     
            nId = setInterval(() => {
                setNeedle(prevRotation => {
                    if (Math.round(prevRotation) === moveNeedle) {
                        return prevRotation;
                    }
    
                    if (prevRotation < moveNeedle) {
                        return prevRotation + step;
                    }
    
                    return prevRotation - step;
                });            
            }, 50);
        }, 1500);

        return () => {
            clearTimeout(delay);
            clearInterval(nId);
        };
    }, [moveNeedle, isNeedleRunning]);

    useEffect(() => {
        if (isBallRunning) {
            return;
        }

        let step = 10; 
        let bId, delay;

        delay = setTimeout(() => {
            bId = setInterval(() => {
                setBallX(x => {
                    if (x === moveBall) {
                        return x;
                    }
    
                    if (x < moveBall) {
                        return x + step
                    }
    
                    return x - step;
                });   
            }, 50);
        }, 1500);


        return () => {
            clearTimeout(delay);
            clearInterval(bId);
        };
    }, [moveBall, isBallRunning]);

    useEffect(() => {
        let step = 1;

        const incrementNeedle = (n, step) => {
            if (n + step < 90) {
                return n + step;
            }
            return n;
        };

        const decrementNeedle = (n, step) => {
            if (n - step > -90) {
                return n - step;
            }
            return n;
        };

        const incrementBall = (x, step) => {
            if (x + step + 10 < 340) {
                return x + step;
            }
            return x;
        };

        const decrementBall = (x, step) => {
            if (x - step + 10 > 0) {
                return x - step;
            }
            return x;
        };

        const handleKeyDown = (e) => {
            e.preventDefault();
            
            const key = e.key;

            if (key === "a") {
                setNeedle(n => incrementNeedle(n, step));
                setIsNeedleRunning(true);
            } else if (key === "z") {
                setNeedle(n => decrementNeedle(n, step));
                setIsNeedleRunning(true);
            }

            if (key === "ArrowLeft") {
                setBallX(x => decrementBall(x, 10));
                setIsBallRunning(true);
            } else if (key === "ArrowRight") {
                setBallX(x => incrementBall(x, 10));
                setIsBallRunning(true);
            }

            step *= 1.05;
        };

        const handleKeyUp = (e) => {
            const key = e.key;

            if (key === "a" || key === "z") {
                step = 1;
                setIsNeedleRunning(false);
            }

            if (key === "ArrowLeft" || key === "ArrowRight") {
                setIsBallRunning(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    return (
        <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: "20px", 
            alignItems: "center",
            justifyContent: "center"
        }}>
            <Needle rotate={needle} />
            <SlipBall ballX={ballX} />
        </div>
    );
}

export default Control;