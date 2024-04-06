// import { useCallback, useState } from "react";
import TaskManagerGame from "./TaskManagerGame";

function TaskManager() {


    const handleFinish = (score) => {
        alert(JSON.stringify(score))
    };


    return <TaskManagerGame onFinish={handleFinish} />;
}

export default TaskManager;