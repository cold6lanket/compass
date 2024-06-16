import { useRef, useEffect, useState } from "react";
import { Block } from "./block";
import { AnimationFrame } from "./animationFrame";
import { calcResult } from "../../utils";
import PlaneImg from "../../assets/plane.png";

const GAME_DURATION = 30_000;

function SlalomGame() {
    const [result, setResult] = useState(null);
    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const {width} = containerRef.current.getBoundingClientRect();
        const wWidth = width;
        const wHeight = window.innerHeight;
        const canvas = canvasRef.current;
        canvas.width = wWidth;
        canvas.height = wHeight;

        const ctx = canvas.getContext("2d");

        const leftLimit = wWidth / 8;
        const blockWidth = 190;
        const rightLimit =  wWidth - leftLimit - blockWidth;

        const path = initPath(leftLimit, rightLimit, wHeight);

        const blocks = [];

        const elemHeight = 20;
        const blockHeight = wHeight / 11;

        for (let i = 0; i < 12; i++) {
            blocks.push(new Block(ctx, path[i], -blockHeight, elemHeight));
        }

        const blockSpeed = 3;
        const planeTop = 500;
        const planeHeight = 50;
        const planeWidth = 50;
        let bcMainCount = 0;
        let blockBack = 10;
        let planeLeft = 500;
        let rightPressed = false;
        let leftPressed = false;

        const movePlane = (e) => {
            if (e.key === 'ArrowLeft' || e.keyCode === 37) {
                leftPressed = true;
            } else if (e.key === 'ArrowRight' || e.keyCode === 39) {
                rightPressed = true;
            }
        };

        const releasePlane = (e) => {
            if (e.key === 'ArrowLeft' || e.keyCode === 37) {
                leftPressed = false;
            } else if (e.key === 'ArrowRight' || e.keyCode === 39) {
                rightPressed = false;
            }
        };

        window.addEventListener("keydown", movePlane);
        window.addEventListener("keyup", releasePlane);

        const planeImg = new Image(); 
        planeImg.src = PlaneImg;

        let correct = 0;
        let incorrect = 0;

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const planeBottom = planeTop + planeHeight;
            const planeRight = planeLeft + planeWidth;

            if (rightPressed) {
                if (planeLeft < wWidth - planeWidth) {
                    planeLeft += 4; 
                }
            } else if (leftPressed) {
                if (planeLeft > 0) {
                    planeLeft -= 4; 
                }
            }

            // plane    
            ctx.drawImage(planeImg, planeLeft, planeTop, planeHeight, planeWidth);

            blocks.forEach((block, i) => {
                if (bcMainCount > (blockHeight * i)) {
                    block.top = block.top + blockSpeed;

                    const blockLeft = block.left;
                    const blockRight = blockLeft + 150;

                    if ((block.top + blockHeight) > planeTop && block.top < planeBottom) {
                        if (blockLeft < planeLeft && blockRight > planeRight) {
                            correct++;
                        } else {
                            incorrect++;
                        }
                    }

                    if (block.top > wHeight) {
                        block.top = -blockHeight;
                        blockBack++;
                        block.left = path[blockBack];
                    }

                    block.draw();
                }
            });

            bcMainCount += blockSpeed;
        }

        const slalom = new AnimationFrame(60, animate);

        planeImg.onload = function() {
            slalom.start();
        };

        const timeoutID = setTimeout(() => {
            window.removeEventListener("keydown", movePlane);
            window.removeEventListener("keyup", releasePlane);
            slalom.stop();
            
            setResult( calcResult(correct, incorrect) );
        }, GAME_DURATION);

        return () => {
            window.removeEventListener("keydown", movePlane);
            window.removeEventListener("keyup", releasePlane);
            slalom.stop();
            clearTimeout(timeoutID);
        };
    }, []);

    useEffect(() => {
        if (result) {
            // TODO. game is over. Proceed to result page.
            console.log("Result: " + result);
        }
    }, [result]);

    return (
        <div ref={containerRef}>
            <canvas
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                }}
                ref={canvasRef}
            ></canvas>
        </div>
    );
}

function initPath(leftLimit, rightLimit, wHeight) {
    let startBlockL = 500, pathCounter = 0, setDirection = 0;
    let plength = 0;
    let rStep = Math.floor(Math.random() * 60) - 30;
    const path = [];
    const changeStep = 10;
    const pathStep = 80 * (wHeight / 1100);
    const pathLength = 5;

    for (let i = 0; i < 100_000; i++) {
        pathCounter++;
        if (pathCounter > plength) {
            setStep();
        }
        if (setDirection == 0) {
            rStep += ((pathCounter * 2) - rStep) / changeStep;
        } else {
            rStep -= ((pathCounter * 2) - rStep) / changeStep;
        }
        startBlockL += rStep;
        path.push(startBlockL);
    }

    function setStep() {
        if (startBlockL < leftLimit) {
            rStep = Math.floor(Math.random() * pathStep);
        } else if (startBlockL > rightLimit) {
            rStep = Math.floor(Math.random() * pathStep) - pathStep;
        } else {
            rStep = Math.floor(Math.random() * pathStep) - (pathStep / 2);
        }
        setDirection = Math.round(Math.random());
        plength = Math.floor(Math.random() * pathLength);
        pathCounter = 0;
    }

    return path;
}

export default SlalomGame;