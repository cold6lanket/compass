import { useState } from "react";
import TaskManagerGame from "./TaskManagerGame";
import TaskManagerIntro from "./TaskManagerIntro";
import TaskManagerResult from "./TaskManagerResult";

function TaskManager() {
    const [currentPage, setCurrentPage] = useState("intro");
    const [result, seResult] = useState(null);

    const handleFinish = (score) => {
        setCurrentPage("result");
        seResult(score);
    };


    return (
        <>
            {currentPage === "intro" && <TaskManagerIntro onStart={() => setCurrentPage("game")} />}
            {currentPage === "game" && <TaskManagerGame onFinish={handleFinish} />}
            {currentPage === "result" && <TaskManagerResult result={result} />}
        </>
    );
}

export default TaskManager;