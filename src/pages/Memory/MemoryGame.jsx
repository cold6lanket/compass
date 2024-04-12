import { useState, useEffect, useMemo } from "react";
import { Typography } from 'antd';
import AutoPilotDisplay from "../../components/AutoPilotDisplay";
import { generateRandomNumber } from "../../utils";
import { MAX_ALTITUDE, MAX_HEADING, MAX_SPEED } from "../../utils/constants";
import styles from "./MemoryGame.module.css";

const { Title } = Typography;

const QUESTION_COUNT = 10;
const GUESS_TIMEOUT = 10_000;
const MEMORIZE_TIMEOUT = 10_000;

const initQuestions = () => {
    const result = [];

    for (let i = 0; i < QUESTION_COUNT; i++) {
        const altitude = generateRandomNumber(1000, MAX_ALTITUDE, 500);
        const heading = generateRandomNumber(0, MAX_HEADING, 5);
        const speed = generateRandomNumber(60, MAX_SPEED, 10);
        result.push({altitude, heading, speed});
    }

    return result;
};

function MemoryGame() {
    const [settings, setSettings] = useState({
        altitude: null,
        heading: null,
        speed: null
    });
    const [score, setScore] = useState(0);
    const [phase, setPhase] = useState("memorization");
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [disable, setDisable] = useState(true);
    const [locked, setLocked] = useState([]);
    const [isGameOver, setIsGameOver] = useState(false);

    const predefinedSettings = useMemo(initQuestions, []);

    useEffect(() => {
        const values = predefinedSettings[currentQuestionIdx];

        setLocked([]);

        setDisable(true);

        if (!values) {
            setIsGameOver(true);
            return;
        }

        setSettings(values);

        setPhase("memorization");

        const guessTimer = setTimeout(() => {
            setSettings({
                altitude: null,
                heading: null,
                speed: null
            });
            setPhase("guessing");
            setDisable(false);
        }, MEMORIZE_TIMEOUT);

        return () => {
            clearTimeout(guessTimer);
        };
    }, [currentQuestionIdx, predefinedSettings]);

    useEffect(() => {   
        let timer;

        if (phase === "guessing") {
            timer = setTimeout(() => {
                setCurrentQuestionIdx(idx => idx + 1);
            }, GUESS_TIMEOUT);
        
        }

        return () => {
            timer !== undefined && clearTimeout(timer);
        };
    }, [phase]);

    const handleEnter = ([name, value]) => {
        const correctParams = predefinedSettings[currentQuestionIdx];

        const firstLetter = name[0];

        if (locked.includes(name)) {
            // User is trying to enter one more time
            return;
        }

        setLocked(locked => [...locked, name]);
            
        if (!value.toLowerCase().endsWith(firstLetter)) {
            return;
        }

        if (correctParams[name] === parseInt(value)) {
            setScore(score => score + 1);
        }
    };

    const handleChange = (values) => {
        setSettings({...settings, ...values});
    };

    let titleClass = styles.title;

    if (phase === "guessing") {
        titleClass = styles.titleBlink;
    }

    if (isGameOver) {
        let result = (score / (QUESTION_COUNT * 3)) * 100;
        result = Math.round(result) + "%";
        alert("Result: " + result);
    }

    return (
        <div className={styles.wrapper}>
            <div>
                <Title type="warning" level={4} className={titleClass}>Enter new settings</Title>
                <AutoPilotDisplay 
                    {...settings} 
                    onEnter={handleEnter}
                    onChange={handleChange} 
                    editable
                    disable={disable}
                />
            </div>
        </div>
    );
}

export default MemoryGame;