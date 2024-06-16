import { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import SlipBall from "../../components/Instrument/SlipBall";
import Needle from "../../components/Instrument/Needle";
import { generateRandomNumber, calcResult } from "../../utils";

const containerStyle = {
    display: "flex", 
    flexDirection: "column", 
    gap: "20px", 
    alignItems: "center",
    justifyContent: "center"
};

// TODO. add Gamepad controller support

function Control({
    invertBall = false, 
    invertNeedle = false, 
    isTestOver = false,
    onResult
}) {
    const [ballX, setBallX] = useState(280);
    const [needle, setNeedle] = useState(0);

    const [isBallRunning, setIsBallRunning] = useState(false);
    const [isNeedleRunning, setIsNeedleRunning] = useState(false);

    const [moveNeedle, setMoveNeedle] = useState(30);
    const [moveBall, setMoveBall] = useState(0);

    const [correct, setCorrect] = useState(0);
    const [incorrect, setIncorrect] = useState(0);

    const ballRef = useRef(null);

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
            // user is moving needle, no need to change needle until user stops giving input
            return;
        }

        let step = 1;
        let nId, delay; 

        delay = setTimeout(() => {     
            nId = setInterval(() => {
                setNeedle(prevRotation => {
                    // TODO. find better way to handle this case
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
                    // TODO. find better way to handle this case
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
        const computedStyle = getComputedStyle(ballRef.current);

        let ballBarWidth = ballRef.current.clientWidth; 
        ballBarWidth -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);

        let step = 1;

        const maxDeg = 90;

        const incrementNeedle = (n, step) => {
            if (n + step < maxDeg) {
                return n + step;
            }
            return n;
        };

        const decrementNeedle = (n, step) => {
            if (n - step > -maxDeg) {
                return n - step;
            }
            return n;
        };

        const incrementBall = (x, step) => {
            if (x + step + 10 < ballBarWidth) {
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
                if (invertNeedle) {
                    setNeedle(n => decrementNeedle(n, step));
                } else {
                    setNeedle(n => incrementNeedle(n, step));
                }
                setIsNeedleRunning(true);
            } else if (key === "z") {
                if (invertNeedle) {
                    setNeedle(n => incrementNeedle(n, step));
                } else {
                    setNeedle(n => decrementNeedle(n, step));
                }
                setIsNeedleRunning(true);
            }

            if (key === "ArrowLeft") {
                if (invertBall) {
                    setBallX(x => incrementBall(x, 10));
                } else {
                    setBallX(x => decrementBall(x, 10));
                }
                setIsBallRunning(true);
            } else if (key === "ArrowRight") {
                if (invertBall) {
                    setBallX(x => decrementBall(x, 10));
                } else {
                    setBallX(x => incrementBall(x, 10));
                }
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
    }, [invertBall, invertNeedle]);

    useEffect(() => {
        if (needle >= -10 && needle <= 10) {
            setCorrect(c => c + 1);
        } else {
            setIncorrect(t => t + 1);
        }
    }, [needle]);

    useEffect(() => {
        if (ballX > (342 / 2) - 30 && ballX < (342 / 2) + 30) {
            setCorrect(c => c + 1);
        } else {
            setIncorrect(t => t + 1);
        }
    }, [ballX]);

    useEffect(() => {
        if (isTestOver) {
            const result = calcResult(correct, incorrect);
            if (typeof onResult === "function") {
                onResult(result);   
            }
        }
    }, [isTestOver, correct, incorrect, onResult]);

    return (
        <div style={containerStyle}>
            <Needle rotate={needle} />
            <SlipBall ref={ballRef} ballX={ballX} />
        </div>
    );
}

Control.propTypes = {
    invertBall: PropTypes.bool,
    invertNeedle: PropTypes.bool,
    isTestOver: PropTypes.bool,
    onResult: PropTypes.func
};

export default Control;