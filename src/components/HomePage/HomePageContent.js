import classes from './HomePageContent.module.css';
import {Button, Checkbox, Grid, Icon, Input} from "semantic-ui-react";
import TaskList from "./TaskList/TaskList";
import {MapContainer, Marker, TileLayer} from "react-leaflet";
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import {useEffect, useState} from "react";
import {getAllTasks, getTasks} from "../../store/task";
import {useAppDispatch} from "../../root";
import {useSelector} from "react-redux";
import {getUserToken} from "../../store/auth";
import React from 'react'
import {categories} from "../../utils/taskCategory";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {getCategoryLabel} from "../../utils/functions";
import i18n from "../../i18n";
import MapLeafletComponent from "../NewTask/MapLeafletComponent";
import {useDebouncedCallback} from "use-debounce";

const HomePageContent = () => {
    const {t} = useTranslation();
    const {language} = i18n;

    const [latitude, setLatitude] = useState(52);
    const [longitude, setLongitude] = useState(19);
    const center = [latitude, longitude]
    const tasks = useSelector(getAllTasks);
    const dispatch = useAppDispatch();
    const token = useSelector(getUserToken);
    const [currentTask, setCurrentTask] = useState({})
    const [zoom, setZoom] = useState(6);
    const [category, setCategory] = useState('');
    const [status] = useState('AWAITING');
    const [addressDebouncedValue, setAddressDebouncedValue] = useState();

    useEffect(() => {
        if (addressDebouncedValue) {
            try {
                let url = `http://api.positionstack.com/v1/forward?access_key=ef70f7232d903256e72a4cda3ddb4ebd&query=${addressDebouncedValue}`;
                return fetch(url, {
                    method: 'GET'
                }).then((response) => {
                    response.json().then(response => {
                        const {data} = response;
                        const locationFromApi = data[0];
                        if (locationFromApi) {
                            const {latitude: newLatitude, longitude: newLongitude} = locationFromApi;
                            setLatitude(newLatitude);
                            setLongitude(newLongitude);
                            setZoom(16);
                        }
                    })
                })
            } catch (error) {
                throw error;
            }
        }
    }, [addressDebouncedValue]);

    const overflowTaskListStyle = {overflow: "auto", height: "778px"};

    //leaflet icon issue
    let DefaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    useEffect(() => {
        if (token) {
            dispatch(getTasks({isUserTasks: false, token, category, status}));
        }
    }, [token, category, dispatch, status]);


    const selectCurrentTask = (id) => {
        const task = tasks.find(t => t.id === id);
        setCurrentTask(task);
        setZoom(12);
        setLatitude(task.latitude);
        setLongitude(task.longitude);
    }

    const selectTaskFromMap = (e, taskId) => {
        const task = tasks.find(t => t.id === taskId);
        setCurrentTask(task);
        setZoom(12);
        setLatitude(task.latitude);
        setLongitude(task.longitude);
    }

    const resetMapHandler = () => {
        setZoom(6);
        setLongitude(19);
        setLatitude(52)
    }

    const filterCategory = (e, button) => {
        e.preventDefault();
        const {content} = button;
        setCategory(content);
        resetMapHandler();
    }

    const localizationHandler = () => {
        navigator.geolocation.getCurrentPosition(function (position) {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            setZoom(13);
        });
    }
    //
    // const categoriesBar = Object.entries(categories).map((array) => {
    //     const [categoryId, categoryObj] = array
    //     const label = getCategoryLabel(categoryId, language);
    //     return <Button color={categoryObj.colors} onClick={filterCategory}
    //                    content={categoryId}>{label}</Button>
    // })

    const categoriesBar = Object.entries(categories).map((arr) => {
        const [categoryId, categoryObj] = arr
        const label = getCategoryLabel(categoryId, language);
        return <Button compact size='medium' color={categoryObj.colors}>
            <Checkbox radio label={label}
                      category={categoryId}
                      defaultChecked={category}
                      checked={category === categoryId}
                      onChange={(e, data) => setCategory(data.category)}> </Checkbox>
        </Button>
    })

    const debounced = useDebouncedCallback(
        (value) => {
            setAddressDebouncedValue(value);
        },
        1000
    );

    return (
        <section>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={1}/>
                    <Grid.Column width={15}>
                        <div className={classes.localization__buttons}>
                            <Input placeholder={t("enterAddress")} onChange={(e) => debounced(e.target.value)}/>
                            <Button floated='left' onClick={resetMapHandler} className={classes.resetMap__button}>
                                {t("defaultMap")}
                            </Button>
                            <Button floated='left' onClick={localizationHandler}>
                                <Icon name='compass'/>{t("detectLocation")}
                            </Button>

                        </div>
                        <div>
                            <Button className={classes.category__buttons} content='' floated='left'
                                    onClick={filterCategory}>{t("all")}</Button>
                            <Button.Group className={classes.category__buttons} floated='left'>
                                {categoriesBar}
                            </Button.Group>
                        </div>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column only={"computer tablet"} widescreen={10} largeScreen={9} computer={8} tablet={7}>
                        <MapContainer className={classes.map__container} center={center} zoom={zoom}
                                      scrollWheelZoom={true}>
                            <MapLeafletComponent zoom={zoom} center={center}/>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {tasks?.length > 0 && tasks && tasks.map((task) => (
                                <Marker position={[task.latitude, task.longitude]}
                                        eventHandlers={{
                                            click: (e) => {
                                                selectTaskFromMap(e, task.id)
                                            }
                                        }}>
                                </Marker>
                            ))}
                        </MapContainer>
                    </Grid.Column>
                    <Grid.Column widescreen={6} largeScreen={7} computer={8} tablet={9} mobile={16}>
                        {tasks?.length > 0 && tasks
                            ?
                            <TaskList tasks={tasks} onClick={selectCurrentTask} isUserTasks={false}
                                      overflowTaskListStyle={overflowTaskListStyle} currentTask={currentTask}/>
                            :
                            (<div className={classes.noTasks__button}>
                                <Button><Link to="/newTask">{t("noTasksAddNew")}</Link></Button>
                            </div>)
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </section>
    );
};
export default HomePageContent;