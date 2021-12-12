import {useCallback, useContext, useEffect, useState} from "react";
import AuthContext from "../../../../store/auth-context";
import TaskItem from "./TaskItem/TaskItem";
import classes from "../TaskList/TaskList.module.css";

const TaskList = ({isUserTasks}) => {
    const authContext = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:8080/api/task?userTasks=${isUserTasks}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + authContext.token,
                    'Content-Type': 'application/json'
                }
            })
            console.log(response)
            if (!response.ok) {
                throw new Error('Fetch error');
            }

            const data = await response.json();
            const fetchedTasks = [];

            setTasks([...data])
        } catch (error) {
            setError(error.message);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchTasks();
    }, []);


    return (
        <ul>
            {tasks.map((task) => (
                <TaskItem props={task}/>
            ))}
        </ul>
    );
};

export default TaskList;