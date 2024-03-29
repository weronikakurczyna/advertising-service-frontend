import {useSelector} from "react-redux";
import {getCurrentUserEmail, getUser, getUserInfo, getUserToken} from "../../../store/auth";
import {Button, Grid, Header, Image, Table} from "semantic-ui-react";
import classes from "../../Profile/UserProfile.module.css";
import profile from "../../../files/profile.jpg";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {useAppDispatch} from "../../../root";
import ChangePassword from "../../Profile/UserTasks/UserProfileModals/ChangePassword";
import ChangeUserData from "../../Profile/UserTasks/UserProfileModals/ChangeUserData";
import UpdateUserImage from "../../Profile/UserTasks/UserProfileModals/UpdateUserImage";
import DeleteUserImage from "../../Profile/UserTasks/UserProfileModals/DeleteUserImage";

const UserDetails = () => {
    const email = useSelector(getCurrentUserEmail);
    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const token = useSelector(getUserToken);
    const user = useSelector(getUserInfo);
    const [modalOpenPassword, setModalOpenPassword] = useState(false);
    const [modalOpenUserInfo, setModalOpenUserInfo] = useState(false);
    const [modalOpenUserImage, setModalOpenUserImage] = useState(false);
    const [modalOpenDeleteUserImage, setModalOpenDeleteUserImage] = useState(false);

    useEffect(() => {
        if (token) {
            dispatch(getUser({token, email}))
        }
    }, []);

    const changePasswordHandler = () => {
        setModalOpenPassword(true);
    }
    const changeUserInfoHandler = () => {
        setModalOpenUserInfo(true);
    }

    const updateUserImageHandler = () => {
        setModalOpenUserImage(true);
    }

    const deleteUserImageHandler = () => {
        setModalOpenDeleteUserImage(true);
    }

    return (
        <section className={classes.section}>
            <Grid centered>
                <Grid.Row>
                    <ChangePassword open={modalOpenPassword} setOpen={setModalOpenPassword} email={email}/>
                    <ChangeUserData open={modalOpenUserInfo} setOpen={setModalOpenUserInfo} email={email}
                                    user={user}/>
                    <UpdateUserImage open={modalOpenUserImage} setOpen={setModalOpenUserImage} email={email}/>
                    <DeleteUserImage open={modalOpenDeleteUserImage} setOpen={setModalOpenDeleteUserImage}
                                     email={email}/>

                    <Grid.Column width={6}>
                        {user.image
                            ? (<div><Image className={classes.profileImage} src={user.image} rounded/>
                                <Button size='mini' onClick={updateUserImageHandler}
                                        className={classes.userImage__button}>{t("changeImage")}</Button>
                                <Button size='mini' onClick={deleteUserImageHandler}
                                        className={classes.userImage__button}>{t("deleteImage")}</Button></div>)
                            : (<div><Image className={classes.profileImage} src={profile} rounded/>
                                <Button size='mini' onClick={updateUserImageHandler}
                                        className={classes.userImage__button}>{t("addImage")}</Button></div>)
                        }
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Header as='h1'>
                            {user.name}
                            <Header.Subheader>{user.location}</Header.Subheader>
                        </Header>
                        <Button onClick={changePasswordHandler}>{t("changePassword")}</Button>
                        <Button onClick={changeUserInfoHandler}>{t("editData")}</Button>

                        <Table className={classes.userInfo__container}>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell>
                                        <Header as='h4' image>
                                            <Header.Content>E-mail</Header.Content>
                                        </Header>
                                    </Table.Cell>
                                    <Table.Cell>{user.email}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <Header as='h4' image>
                                            <Header.Content>{t("phoneNumber")}</Header.Content>
                                        </Header>
                                    </Table.Cell>
                                    <Table.Cell>{user.phoneNumber}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <Header as='h4' image>
                                            <Header.Content>{t("accountCreationDate")}</Header.Content>
                                        </Header>
                                    </Table.Cell>
                                    <Table.Cell>{user.createDate}</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </section>
    )}


export default UserDetails;