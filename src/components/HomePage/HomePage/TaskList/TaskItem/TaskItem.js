import {Button, Card, Grid, Header, Icon, Image} from "semantic-ui-react";
import taskIcon from '../../../../../files/task.png';
import classes from "../TaskItem/TaskItem.module.css";
import {formatDate} from "../../../../../utils/functions";
import {useHistory} from "react-router-dom";
import {setCurrentTaskId} from "../../../../../store/task";
import {useAppDispatch} from "../../../../../root";
import TaskDetails from "./TaskDetails/TaskDetails";
import Link from "react-router-dom/es/Link";


const TaskItem = ({props, onClick, isUserTasks}) => {
    const history = useHistory();
    const dispatch = useAppDispatch()

    const taskDetailsHandler = () => {
        dispatch(setCurrentTaskId(props.id))
        // history.replace(`/taskDetails/${props.id}`);
        history.push({
            pathname: `/taskDetails/${props.id}`,
            state: {isUserTasks: isUserTasks}
        });

        // TaskDetails(isUserTasks={isUserTasks});
    }

    const onClickHandler = () => onClick(props.id)


    return (
        <Card fluid centered className={classes.taskCard} onClick={onClickHandler}>
            <Card.Content>
                <Grid className={classes.taskRow}>
                    <Grid.Row >
                        <Grid.Column width={3}>
                            {props.image != null
                                ? <Image src={props.image} rounded size='medium'/>
                                : <Image src={taskIcon} rounded size='medium'/>
                            }
                        </Grid.Column>
                        <Grid.Column width={13}>
                            <Grid.Row className={classes.category__container}>
                                <Grid.Column width={5}>
                                    <p className={classes.category__chip}>{props.category}</p>
                                </Grid.Column>
                                <Grid.Column width={11} floated='right'>
                                    <Button floated='right' fluid onClick={taskDetailsHandler} >
                                        <Button.Content>Szczegóły</Button.Content>
                                    </Button>
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row>
                                <Grid.Row>
                                    <Header as='h3' content={props.title}/>
                                </Grid.Row>
                            </Grid.Row>

                            <div className={classes.taskDetails__container}>
                                <Grid.Column width={3}>
                                    <div className={classes.taskDetails__main__info}><Icon
                                        name='location arrow'/>{props.address}
                                    </div>
                                    <div className={classes.taskDetails__main__info}><Icon
                                        name='calendar times'/>{formatDate(props.expirationDate)}</div>
                                </Grid.Column>
                                <Grid.Column width={7}>
                                    <div className={classes.taskDetails__payment__details}><Icon
                                        name='money'/> {props.pay} PLN
                                    </div>
                                    <div className={classes.taskDetails__payment__details}><Icon
                                        name='time'/> {props.estimatedTime} h
                                    </div>
                                </Grid.Column>
                            </div>
                        </Grid.Column>
                    </Grid.Row>

                </Grid>
            </Card.Content>
        </Card>
    );
};

export default TaskItem;