import { useState, useEffect } from "react";
import AutoPilotDisplay from "../../components/AutoPilotDisplay";
import { 
    randomIntFromInterval, 
    generateRandomNumber,
    countEqualParams 
} from "../../utils";
import { MAX_ALTITUDE, MAX_HEADING, MAX_SPEED } from "../../utils/constants";

function MemoryGame() {
    const [settings, setSettings] = useState({
        current: {
            altitude: "",
            heading: "",
            speed: "",
        },
        prev: {
            altitude: "",
            heading: "",
            speed: "",
        }
    });
    const [predifinedSettings, setPredefinedSettings] = useState(() => {
        const result = [];
        // 10 questions
        for (let i = 0; i < 10; i++) {
            const altitude = generateRandomNumber(1000, MAX_ALTITUDE, 500);
            const heading = generateRandomNumber(0, MAX_HEADING, 5);
            const speed = generateRandomNumber(60, MAX_SPEED, 10);
            result.push({altitude, heading, speed});
        }

        return result;
    });

    return (
        <AutoPilotDisplay 
            {...settings.current} 
            onChange={v => setSettings({...settings, ...v})} 
            editable 
        />
    );
}

export default MemoryGame;