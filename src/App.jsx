import { useState } from 'react'
import AutoPilotSettings from './components/AutoPilotSettings';
import AutoPilotDisplay from './components/AutoPilotDisplay';
import Numpad from './components/Numpad';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
        <div style={{ position: "absolute", top: "10px", left: 10 }}>
            <Numpad activeIdx={3} />
        </div>
        <div style={{ position: "absolute", top: "10px", right: 10 }}>
            <Numpad activeIdx={undefined} />
        </div>
        <div style={{ position: "absolute", bottom: "20px", left: 10 }}>
            <AutoPilotSettings altitude={5000} heading={120} speed={100} />
        </div>
        <div style={{ position: "absolute", bottom: "20px", right: 10 }}>
            <AutoPilotDisplay altitude={12000} heading={20} speed={300} />
        </div>
    </div>
  )
}

export default App
