import TaskList from "../../HomePage/HomePage/TaskList/TaskList";
import {Button} from "semantic-ui-react";
import {useHistory} from "react-router-dom";
import classes from "../UserProfile.module.css";
import React, {useEffect, useState} from "react";
import {getAllTasks, getTasks} from "../../../store/task";
import {useAppDispatch} from "../../../root";
import {useSelector} from "react-redux";
import {getUserToken} from "../../../store/auth";
import Link from "react-router-dom/es/Link";
import {statuses} from "../../../utils/taskStatus";


const UserTasks = () => {
    const history = useHistory();
    const dispatch = useAppDispatch();
    const token = useSelector(getUserToken);
    const tasks = useSelector(getAllTasks);
    const [status, setStatus] = useState('');
    const userInfoHandler = () => {
        history.replace('/profile');
    }

    const userTasksHandler = () => {
        history.replace('/userTasks');
    }

    const onClickFunction = (id) => {
        const task = tasks.find(t => t.id === id);
    }

    const filterTasks = (e, button) => {
        const {content} = button;
        setStatus(content);
    }

    useEffect(() => {
        if (token) {
            dispatch(getTasks({isUserTasks: true, token, status}));
        }
    }, [token, status]);

    return <div className={classes.section}>
        <Button onClick={userInfoHandler}>Dane</Button>
        <Button onClick={userTasksHandler}>Moje ogłoszenia</Button>
        <Button.Group>
            <Button content='' floated='left' onClick={filterTasks}>Wszystkie</Button>
            {statuses.map((status) => (
                <Button color={status.color} onClick={filterTasks}
                        content={status.id}>{status.label}</Button>
            ))}
        </Button.Group>
        {tasks?.length > 0 && tasks
            ?
            <TaskList tasks={tasks} onClick={onClickFunction} isUserTasks='true'/>
            :
            (<div className={classes.noTask__button}>
                <Button><Link to="/newTask">Brak ogłoszeń. Kliknij, aby dodać pierwsze zlecenie.</Link></Button>
            </div>)
        }
    </div>
}

export default UserTasks;