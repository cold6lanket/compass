import { useState } from "react";
import Plane from "../../elements/Plane";
import ArtificialHorizon from "../ArtificialHorizon/ArtificialHorizon";
import Compass from "../Compass/Compass";
import PlaneGrid from "../PlaneGrid/PlaneGrid";
import Rbi from "../Rbi/Rbi";
import { 
    randomIntFromInterval, 
    generateRandomNumber, 
    randomIntFromIntervalWithExclusion 
} from "../../utils";
import styles from "./Orientation.module.css";

function Orientation() {
    const [questions] = useState( createQuestions );
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

    function getInstrumentData() {
        const heading = generateRandomNumber(0, 360, 45);
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

        for (let i = 0; i < n; i++) {
            const fillCells = {};
            const exclude = [towerIdx];

            for (let j = 0; j < 4; j++) {
                const idx = randomIntFromIntervalWithExclusion(0, 24, exclude);
                exclude.push(idx);
                fillCells[idx] = getInstrumentData();
            }
            const idx = randomIntFromInterval(0, 3);
            const correctIdx = Number( Object.keys(fillCells)[idx] );

            const instruments = {
                ...fillCells[correctIdx],
                beaconPoint: getAngleRelativeToTower(fillCells[correctIdx].heading, correctIdx)
            };

            let sortKs = Object.keys(fillCells).sort((a, b) => Number(a) - Number(b));
            sortKs = Object.fromEntries( sortKs.map((k, i) => [k, i + 1]) );

            for (const k in sortKs) {
                fillCells[k].nth = sortKs[k];
            }

            result.push({fillCells, instruments, correctNth: sortKs[correctIdx]});
        }

        return result;
    }

    const {instruments, fillCells} = questions[currentQuestionIdx];

    const cells = {...fillCells};

    for (const k in cells) {
        cells[k] = <Plane {...cells[k]} />;
    }

    return (
        <div className={styles.content}>
            <div className={styles.instruments}>
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
            </div>
            <PlaneGrid fillCells={cells} />
        </div>
    );
}

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

function getAngleRelativeToTower(planeHeading, planeIdx, towerIdx = 12) {
    const grid = getPlaneGrid();
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