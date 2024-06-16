import { useState } from "react";
import PropTypes from "prop-types";
import { Flex, Typography, Button } from 'antd';
import Plane from "../../elements/Plane";
import NumberInput from "../../elements/NumberInput";
import ArtificialHorizon from "../ArtificialHorizon/ArtificialHorizon";
import Compass from "../Compass/Compass";
import PlaneGrid from "../PlaneGrid/PlaneGrid";
import Rbi from "../Rbi/Rbi";
import Timer from "../../elements/Timer";
import { 
    randomIntFromInterval, 
    generateRandomNumber, 
    randomIntFromIntervalWithExclusion,
    calcResult 
} from "../../utils";
import { MAX_HEADING } from "../../utils/constants";
import styles from "./Orientation.module.css";

function Orientation({onFinish}) {
    const [questions] = useState( createQuestions );
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [answer, setAnswer] = useState(null);
    const [correct, setCorrect] = useState(0);

    function getInstrumentData() {
        const heading = generateRandomNumber(0, MAX_HEADING, 45);
        let pitch, bankAngle;

        if (Math.random() > 0.5) {
            pitch = Math.random() > 0.5 ? "UP" : "DOWN";
        }

        if (Math.random() > 0.5) {
            bankAngle = Math.random() > 0.5 ? "RIGHT" : "LEFT";
        }

        return {heading, pitch, bankAngle};
    }

    function createQuestions(n = 30) {
        const result = [];
        const towerIdx = 12;
        const grid = getPlaneGrid();

        for (let i = 0; i < n; i++) {
            const fillCells = {};
            const exclude = [towerIdx];

            for (let j = 0; j < 4; j++) {
                const idx = randomIntFromIntervalWithExclusion(0, 24, exclude);
                exclude.push(idx);
                fillCells[idx] = getInstrumentData();
            }
            const idx = randomIntFromInterval(0, 3);
            const cells = Object.keys(fillCells);
            const correctIdx = Number( cells[idx] );
            const beaconPoint = getAngleRelativeToTower(grid, fillCells[correctIdx].heading, correctIdx);

            let previousCell, offsets;
            const {row, col} = getRowCol(correctIdx);
            
            if (isDiagonal(correctIdx)) {
                if (correctIdx < towerIdx) {
                    offsets = [-1, 1, 1, -1];
                    if (col < 2) {
                        offsets = [-1, -1, 1, 1];
                    }
                } else {
                    offsets = [1, 1, -1, -1];
                    if (col < 2) {
                        offsets = [1, -1, -1, 1];
                    }
                }
                
            } else if (isCenterLine(correctIdx)) {
                const {row: tRow, col: tCol} = getRowCol(towerIdx);
                if (row > tRow) {
                    // 17, 22
                    offsets = [1, 0, -1, 0];
                } else if (row === tRow) {
                    if (col < tCol) {
                        // 10, 11
                        offsets = [0, -1, 0, 1];
                    } else {
                        // 13, 14
                        offsets = [0, 1, 0, -1];
                    }
                } else {
                    // 2, 7
                    offsets = [-1, 0, 1, 0];
                }
            }

            previousCell = offsets ? getPreviousCell(grid, row, col, ...offsets) : undefined;

            if (previousCell in fillCells) {
                // check instrument similarity
                if (areSameInstrumentReadings(fillCells[previousCell], fillCells[correctIdx])) {
                    let next = {};
                    do {
                        next = getInstrumentData();
                    } while (next.pitch === fillCells[correctIdx].pitch || next.bankAngle === fillCells[correctIdx].bankAngle);

                    fillCells[previousCell].pitch = next.pitch;
                    fillCells[previousCell].bankAngle = next.bankAngle;
                }
            }

            const instruments = {
                ...fillCells[correctIdx],
                beaconPoint
            };

            let sortKs = cells.sort((a, b) => Number(a) - Number(b));
            sortKs = Object.fromEntries( sortKs.map((k, i) => [k, i + 1]) );

            for (const k in sortKs) {
                fillCells[k].nth = sortKs[k];
            }

            result.push({fillCells, instruments, correctNth: sortKs[correctIdx]});
        }

        return result;
    }

    const qLen = questions.length;

    function checkAnswer() {
        const correctAnswer = questions[currentQuestionIdx].correctNth;
        if (correctAnswer === Number(answer)) {
            setCorrect(c => c + 1);
        }
    }

    function doFinish() {
        if (typeof onFinish === "function") {
            onFinish(calcResult(correct, qLen - correct));
        }
    }

    function nextQuestion() {
        checkAnswer();
        if (qLen > currentQuestionIdx + 1) {
            setCurrentQuestionIdx(q => q + 1);
        } else {
            doFinish();
        }
        setAnswer(null);
    }

    const {instruments, fillCells} = questions[currentQuestionIdx];

    const cells = {...fillCells};

    for (const k in cells) {
        cells[k] = <Plane {...cells[k]} />;
    }

    return (
        <Flex gap={30}>
            <div className={styles.content}>
                <Flex justify="space-between">
                    <div>
                        <Rbi beaconPoint={instruments.beaconPoint} />
                        <div className={styles.title}>RBI</div>
                    </div>
                    <div>
                        <ArtificialHorizon 
                            pitch={instruments.pitch} 
                            bankAngle={instruments.bankAngle} 
                        />
                        <div className={styles.title}>Artificial Horizon</div>
                    </div>
                    <div>
                        <Compass heading={instruments.heading} />
                        <div className={styles.title}>Compass</div>
                    </div>
                </Flex>
                <PlaneGrid fillCells={cells} />
            </div>
            <Flex vertical justify="space-between">
                <Timer initialMinutes={10} onTimerUp={doFinish} />
                <Flex vertical gap={20}>
                    <Flex align="center" gap={10}>
                        <Typography.Text>Answer box: </Typography.Text>
                        <NumberInput 
                            style={{width: 50}} 
                            value={answer} 
                            onChange={setAnswer}
                        />
                    </Flex>
                    <Button 
                        type="primary"
                        disabled={!answer} 
                        onClick={nextQuestion} 
                    >
                        {currentQuestionIdx + 1 === qLen ? "Finish" : "Continue"}
                    </Button>
                </Flex>
            </Flex>
        </Flex>
    );
}

Orientation.propTypes = {
    onFinish: PropTypes.func
};

export default Orientation;

function getPlaneGrid() {
    const rows = 5;
    const columns = 5;

    const grid = [];
    let n = 0;

    for (let i = 0; i < rows; i++) {
        const row = [];
        
        for (let j = 0; j < columns; j++) {
            row.push(n);
            n++;
        }

        grid.push(row);
    }

    return grid;
}

function getAngleRelativeToTower(grid, planeHeading, planeIdx, towerIdx = 12) {
    const towerCoords = findCellCoords(grid, towerIdx);
    const planeCoords = findCellCoords(grid, planeIdx);

    const planeCol = grid[planeCoords.row].findIndex(val => val === planeIdx);
    const towerCol = grid[towerCoords.row].findIndex(val => val === towerIdx);

    if (towerCoords.row === planeCoords.row) {
        let angle;
        if (planeIdx > towerIdx) {
            // plane is in the right side of the tower
            angle = 270 - planeHeading;
        } else {
            // plane is in the left side of the tower
            angle = 90 - planeHeading;
        }

        if (angle < 0) {
            angle = 360 + angle;
        }

        return angle;
    } else if (planeCol === towerCol) {
        let angle;

        if (planeIdx > towerIdx) {
            // plane is flying towards tower
            angle = 0 - planeHeading;
        } else {
            angle = 180 - planeHeading;
        }

        if (angle < 0) {
            angle = 360 + angle;
        }

        return angle;
    } else {
        let x, y;
        x = Math.abs(planeCol - towerCol);

        let start = planeCol + x;

        if (planeCol > towerCol) {
            start = planeCol - x;
        }

        let nextRow = planeCoords.row;

        if (planeCoords.row < towerCoords.row) {
            while (grid[nextRow][start] !== towerIdx) {
                nextRow++;
            }
        } else {
            while (grid[nextRow][start] !== towerIdx) {
                nextRow--;
            }
        }

        y = Math.abs(nextRow - planeCoords.row);

        let angle = calcAngleDegrees(x, y);
        
        const quadrant = getQuadrant(angle, towerCoords, planeCoords);
        
        angle = quadrant - planeHeading;

        if (Math.sign(angle) === -1) {
            angle = 360 + angle;
        }

        return angle;
    }
}

function getQuadrant(angle, towerCoords, planeCoords) {
    const {row: tRow, column: tCol} = towerCoords;
    const {row: pRow, column: pCol} = planeCoords;

    let quadrant;

    if (pRow < tRow) {
        if (pCol < tCol) {
            quadrant = 90 + angle;
        } else {
            quadrant = 270 - angle;
        }
    } else {
        if (pCol < tCol) {
            quadrant = 90 - angle;
        } else {
            quadrant = 270 + angle;
        }
    }

    return quadrant;
}

function findCellCoords(grid, target) {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === target) {
                return {row: i, column: j};
            }
        }
    }

    return {};
}

function calcAngleDegrees(x, y) {
    return (Math.atan2(y, x) * 180) / Math.PI;
}

function getRowCol(index) {
    // gridSize = 5
    const row = Math.floor(index / 5);
    const col = index % 5;
    return { row, col };
}

function isDiagonal(index) {
    const { row, col } = getRowCol(index);

    // Check main diagonal (top-left to bottom-right)
    if (row === col) {
        return true;
    }

    // Check anti-diagonal (top-right to bottom-left)
    if (row + col === 5 - 1) {
        return true;
    }

    return false;
}

function isCenterLine(index) {
    const { row, col } = getRowCol(index);

    // Check if in the center row or center column
    if (row === Math.floor(5 / 2) || col === Math.floor(5 / 2)) {
        return true;
    }

    return false;
}

function getPreviousCell(grid, row, col, rowOffset1, colOffset1, rowOffset2, colOffset2) {
    let cell = grid[row + rowOffset1]?.[col + colOffset1];

    if (cell === undefined) {
      cell = grid[row + rowOffset2]?.[col + colOffset2];
    }

    return cell;
}

function areSameInstrumentReadings(cell1, cell2) {
    for (const p in cell1) {
        if (cell1[p] !== cell2[p]) {
            return false;
        }
    }
    return true;
}