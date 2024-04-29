import { useState, useRef, useEffect } from "react";
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

    useEffect(() => {
        if (isNeedleRunning) return;

        let target = generateRandomNumber(10, 90, 5);

        const plusOrMinus = Math.random() < 0.5 ? -1 : 1;

        target *= plusOrMinus;

        const timeout = setTimeout(() => {
            setIsNeedleRunning(true);
            setMoveNeedle(target);
        }, 1000);

        return () => {
            clearTimeout(timeout);
        }
    }, [isNeedleRunning]);

    useEffect(() => {
        if (isBallRunning) return;

        const target = generateRandomNumber(0, 250, 10);

        const timeout = setTimeout(() => {
            setIsBallRunning(true);
            setMoveBall(target);
        }, 1000);

        return () => {
            clearTimeout(timeout);
        };
    }, [isBallRunning]);
    
    useEffect(()=> {

        if (isNeedleRunning && !isNaN(moveNeedle)) {
            let step = 1; 

            const timer = setInterval(() => {
               
                setNeedle(prevRotation => {
                    if (prevRotation < moveNeedle) {
                        return prevRotation + step
                    }
                    return prevRotation - step;
                });

                // step *= 1.01;
                
            }, 50);

            return () => {
                clearInterval(timer);
            };
        }

    }, [isNeedleRunning, moveNeedle]);

    useEffect(()=> {

        if (isBallRunning && !isNaN(moveBall)) {
            let step = 10; 

            const timer = setInterval(() => {
               
                setBallX(x => {
                    if (x < moveBall) {
                        return x + step
                    }
                    return x - step;
                });

                // step *= 1.01;
                
            }, 50);

            return () => {
                clearInterval(timer);
            };
        }

    }, [isBallRunning, moveBall]);

    useEffect(() => {
        let step = 1;

        const incrementNeedle = (n, step) => {
            if (n + step < 90) {
                return  n + step;
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
                setIsNeedleRunning(false);
            } else if (key === "z") {
                setNeedle(n => decrementNeedle(n, step));
                setIsNeedleRunning(false);
            }

            if (key === "ArrowLeft") {
                setBallX(x => decrementBall(x, 10));
                setIsBallRunning(false);
            } else if (key === "ArrowRight") {
                setBallX(x => incrementBall(x, 10));
                setIsBallRunning(false);
            }

            step *= 1.05;
        };

        const handleKeyUp = (e) => {
            const key = e.key;

            if (key === "a" || key === "z") {
                step = 1;
                setIsNeedleRunning(true);
            }

            if (key === "ArrowLeft" || key === "ArrowRight") {
                setIsBallRunning(true);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    if (Math.round(needle) === moveNeedle && isNeedleRunning) {
        setIsNeedleRunning(false);
        //setMoveNeedle(null);
    }

    if (Math.round(ballX) === moveBall && isBallRunning) {
        setIsBallRunning(false);
        //setMoveBall(null);
    }

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