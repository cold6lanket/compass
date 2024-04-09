import { useState } from "react";
import AutoPilotDisplay from "../../components/AutoPilotDisplay";


function MemoryGame() {
    const [settings, setSettings] = useState({
        altitude: "",
        heading: "",
        speed: "",
    });
    return (
        <AutoPilotDisplay {...settings} onChange={v => setSettings({...settings, ...v})} editable />
    );
}

export default MemoryGame;