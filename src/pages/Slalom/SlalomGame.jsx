import { useRef, useEffect, useState } from "react";
import { Block } from "./block";
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

        for (let i = 0; i < 12; i++) {
            blocks.push(new Block(ctx, path[i], -((i * 2) * 20) - 20, elemHeight));
        }

        const blockSpeed = 1;
        const planeTop = 500;
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
        
        planeImg.onload = function() {
            animate();
        };

        let animateId;
        let correct = 0;
        let incorrect = 0;

        function animate() {
            animateId = requestAnimationFrame(animate);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const planeBottom = planeTop + 50;
            const planeRight = planeLeft + 50;

            if (rightPressed) {
                if (planeLeft < wWidth - 50) {
                    planeLeft += 2; 
                }
            } else if (leftPressed) {
                if (planeLeft > 0) {
                    planeLeft -= 2; 
                }
            }

            // plane    
            ctx.drawImage(planeImg, planeLeft, planeTop, 50, 50);

            blocks.forEach((block, i) => {
                if (bcMainCount > (elemHeight * i)) {
                    block.top = block.top + blockSpeed;

                    const blockLeft = block.left;
                    const blockRight = blockLeft + 150;

                    if ((block.top + elemHeight) > planeTop && block.top < planeBottom) {
                        if (blockLeft < planeLeft && blockRight > planeRight) {
                            correct++;
                        } else {
                            incorrect++;
                        }
                    }

                    if (block.top > wHeight) {
                        block.top = -elemHeight;
                        blockBack++;
                        block.left = path[blockBack];
                    }

                    block.draw();
                }
            });

            bcMainCount += blockSpeed;
        }

        const timeoutID = setTimeout(() => {
            window.removeEventListener("keydown", movePlane);
            window.removeEventListener("keyup", releasePlane);
            cancelAnimationFrame(animateId);
            
            setResult( calcResult(correct, incorrect) );
        }, GAME_DURATION);

        return () => {
            window.removeEventListener("keydown", movePlane);
            window.removeEventListener("keyup", releasePlane);
            cancelAnimationFrame(animateId);
            clearTimeout(timeoutID);
        };
    }, []);

    if (result) {
        // TODO. game is over. Proceed to result page.
        console.log("Result: " + result);
    }

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