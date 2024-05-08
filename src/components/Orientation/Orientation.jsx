import { useState, useMemo } from "react";
import Plane from "../../elements/Plane";
import ArtificialHorizon from "../ArtificialHorizon/ArtificialHorizon";
import Compass from "../Compass/Compass";
import PlaneGrid from "../PlaneGrid/PlaneGrid";
import Rbi from "../Rbi/Rbi";
import { randomIntFromInterval, generateRandomNumber } from "../../utils";
import styles from "./Orientation.module.css";

function Orientation() {
    const [currentQuestion, setCurrentQuestion] = useState(0);

    const {instruments, fillCells} = useMemo(() => {
        const acc = {};

        const idx = randomIntFromInterval(0, 24);

        const pHeading = generateRandomNumber(0, 360, 45);
        let pitch, bankAngle;

        if (Math.random() > 0.5 ) {
            pitch = Math.random() > 0.5 ? "UP" : "DOWN";
            bankAngle = Math.random() > 0.5 ? "RIGHT" : "LEFT";
        }

        acc[idx] = <Plane heading={pHeading} pitch={pitch} bankAngle={bankAngle} />;

        return { instruments: {
            beaconPoint: getAngleRelativeToTower(pHeading, idx),
            heading: pHeading,
            pitch,
            bankAngle
        }, fillCells: acc };
    }, []);

    // const fillCells = { 
    //     5: <Plane />, 
    //     18: <Plane heading={180} pitch={"DOWN"} bankAngle="LEFT" />,
    //     24: <Plane heading={270} />
    // };

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
            <PlaneGrid fillCells={fillCells} />
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

        const quadrant = getQuadrant(towerCoords, planeCoords);

        angle = quadrant - planeHeading - angle;

        if (Math.sign(angle) === -1) {
            angle = 360 + angle;
        }

        return angle;
    }
}

function getQuadrant(towerCoords, planeCoords) {
    const {row: tRow, column: tCol} = towerCoords;
    const {row: pRow, column: pCol} = planeCoords;

    let quadrant;

    if (pRow < tRow) {
        if (pCol < tCol) {
            quadrant = 180;
        } else {
            quadrant = 270;
        }
    } else {
        if (pCol < tCol) {
            quadrant = 90;
        } else {
            quadrant = 360;
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