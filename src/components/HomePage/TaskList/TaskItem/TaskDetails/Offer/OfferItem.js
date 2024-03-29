import {useAppDispatch} from "../../../../../../root";
import {Button, Card, Divider, Form, Header, Icon, Image, Rating, Segment} from "semantic-ui-react";
import React, {useEffect, useRef, useState} from "react";
import {
    getCurrentOffer, setCurrentOfferId, updateOffer
} from "../../../../../../store/offer";
import profile from '../../../../../../files/profile.jpg'
import {useSelector} from "react-redux";
import {getUserToken} from "../../../../../../store/auth";
import classes from './OfferItem.module.css';
import {useTranslation} from "react-i18next";
import {createOpinion, getOpinion, getOpinionForOffer} from "../../../../../../store/opinion";
import AnotherUserDetails from "../AnotherUserDetails/AnotherUserDetails";
import DeleteOpinion from "./DeleteOpinion";

const OfferItem = ({offer, isUserTasks, currentOffId}) => {
    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const token = useSelector(getUserToken);
    // const currentOffer = useSelector(getCurrentOffer);
    // let offerId = currentOffer.id;
    const [offerAccepted, setOfferAccepted] = useState(false);
    const [offerRejected, setOfferRejected] = useState(false);
    const [taskCompleted, setTaskCompleted] = useState(false);
    const [opinionSent, setOpinionSent] = useState(false);
    const [rating, setRating] = useState();
    const contentInput = useRef();
    const opinion = useSelector(getOpinionForOffer);
    const [modalOpenDeleteOpinion, setModalOpenDeleteOpinion] = useState(false);

    const [modalShowUser, setModalShowUser] = useState(false);

    // console.log(currentOffer)
    useEffect(() => {
        if (token && !opinion && offer.hasOpinion && !opinionSent) {
            dispatch(getOpinion({token, offerId: currentOffId}))
        }
    }, [offerAccepted, offerRejected, taskCompleted, modalShowUser, opinionSent, offer.hasOpinion, dispatch, token]);


    useEffect(() => {
        dispatch(setCurrentOfferId(currentOffId));
        console.log("current" + currentOffId)
        // console.log("current store " + offerId)
        if (token && offer.hasOpinion) {
            dispatch(getOpinion({token, offerId: currentOffId}))
        }
    }, [currentOffId]);


    const acceptOffer = () => {
        if (token) {
            dispatch(updateOffer({token, offerId: offer.id, offerStatus: 'ACCEPTED'}));
        }
        setOfferAccepted(true);
        //todo
    }

    const rejectOffer = () => {
        if (token) {
            dispatch(updateOffer({token, offerId: offer.id, offerStatus: 'REJECTED'}));
        }
        setOfferRejected(true);
    }

    const completeTaskHandler = () => {
        if (token) {
            dispatch(updateOffer({token, offerId: offer.id, offerStatus: 'COMPLETED'}));
        }
        setTaskCompleted(true);
    }

    const handleRate = (e, {rating}) => {
        setRating(rating);
    }

    const createOpinionHandler = () => {
        const ratingContent = contentInput.current.value;
        if (token && rating) {
            dispatch(createOpinion({
                token, offerId: offer.id, rating, content: ratingContent, taskId: offer.task.id
            }));
            setOpinionSent(true);
        } else {
            alert(t("selectOpinionBeforeSending"))
        }
    }

    const showUser = () => {
        setModalShowUser(true);
    }
    console.log(opinion)
    const deleteOpinionHandler = () => {
        setModalOpenDeleteOpinion(true);
    }
// const rating = opinion.rating;
    return (<section>
        <AnotherUserDetails open={modalShowUser} setOpen={setModalShowUser} email={offer.user.email}/>

        {isUserTasks && offer.status === 'ACTIVE' &&
            <Card fluid className={classes.task__card}>
            <Card.Content>
                {offer.user.image != null ? <Image src={offer.user.image} rounded size='tiny' floated='right'/> :
                    <Image src={profile} rounded size='tiny' floated='right'/>}

                <Card.Header className={classes.card__header}>{t("offerFrom")}</Card.Header>
                <Card.Content className={classes.card__username}>{offer.user.name}</Card.Content>
                <Card.Content className={classes.card__content}><Icon name='home'/>{offer.user.location}</Card.Content>
                <Card.Content className={classes.card__content}><Icon name='phone'/>{offer.user.phoneNumber}</Card.Content>
                <Card.Content className={classes.card__content}><Icon name='mail'/>{offer.user.email}</Card.Content>
                <Button animated circular onClick={showUser} className={classes.offer__button}>
                    <Button.Content visible>{offer.user.email}</Button.Content>
                    <Button.Content hidden>
                        {t("seeDetails")}
                    </Button.Content>
                </Button>
            </Card.Content>
            <Card.Content extra>
                <div className='ui two buttons'>
                    <Button circular  color='teal' onClick={acceptOffer}>
                        {t("accept")}
                    </Button>
                    <Button circular  color='google plus' onClick={rejectOffer}>
                        {t("reject")}
                    </Button>
                </div>
            </Card.Content>
        </Card>}

        {isUserTasks && offer.status === 'ACCEPTED' && <Card fluid>
            <Card.Content>
                {offer.user.image != null ? <Image src={offer.user.image} rounded size='tiny' floated='right'/>
                    : <Image src={profile} rounded size='tiny' floated='right'/>}
                <Card.Header>{t("jobIsPerformedBy")}</Card.Header>
                <Card.Content>{offer.user.name}</Card.Content>
                <Card.Content><Icon name='home'/>{offer.user.location}</Card.Content>
                <Card.Content><Icon name='phone'/>{offer.user.phoneNumber}</Card.Content>
                <Card.Content><Icon name='mail'/>{offer.user.email}</Card.Content>
                <Button animated onClick={completeTaskHandler} className={classes.offer__button}>
                    <Button.Content visible>{t("markTheJobComplete")}</Button.Content>
                    <Button.Content hidden>
                        <Icon size='large' name='calendar outline'/>
                    </Button.Content>
                </Button>
                {/*{taskCompleted && <div className={classes.offerInfo__card}>*/}
                {/*    {t("jobCompleted")}*/}
                {/*</div>}*/}
            </Card.Content>
        </Card>}
        {isUserTasks && offer.status === 'COMPLETED' && !offer.hasOpinion && !opinionSent && <Card fluid className={classes.task__card}>
            <Card.Content>
                {offer.user.image != null ? <Image src={offer.user.image} rounded size='tiny' floated='right'/> :
                    <Image src={profile} rounded size='tiny' floated='right'/>}
                <Card.Header className={classes.card__header}>{t("taskCompletedBy")}</Card.Header>
                <Card.Content className={classes.card__username}>{offer.user.name}</Card.Content>
                <Card.Content className={classes.card__content}><Icon name='home'/>{offer.user.location}</Card.Content>
                <Card.Content className={classes.card__content}><Icon name='phone'/>{offer.user.phoneNumber}</Card.Content>
                <Card.Content className={classes.card__content}><Icon name='mail'/>{offer.user.email}</Card.Content>
                <Divider/>
                {!offer.hasOpinion && <Form onSubmit={createOpinionHandler}>
                    <Header as='h4'>{t("sendOpinion")}</Header>
                    <Form.Field>
                        <Rating maxRating={5} icon='star' size='huge' onRate={handleRate}/>
                    </Form.Field>
                    <Form.Field>
                                <textarea draggable='false' ref={contentInput} minLength="5" maxLength="800"
                                          placeholder={t("writeYourOpinion")}/>
                    </Form.Field>
                    <Button type='submit'>{t("submit")}</Button>
                </Form>}
                {opinionSent && <div className={classes.offerInfo__card}>
                    {t("opinionSent")}
                </div>}
            </Card.Content>
        </Card>}

        {(offerAccepted || offerRejected) && <div className={classes.offerInfo__card}>
            {offerAccepted && <p>{t("offerAccepted")}</p>}
            {offerRejected && <p>{t("offerRejected")}</p>}
        </div>}

        {offer.hasOpinion && opinion && (<Card fluid className={classes.task__card}>
            <DeleteOpinion open={modalOpenDeleteOpinion} setOpen={setModalOpenDeleteOpinion} id={offer.task.id}
                           setOpinionSent={setOpinionSent}/>
            <Card.Content>
                <Card.Header>{t("feedbackFor")}
                    {offer.user.image != null ? <Image src={offer.user.image} rounded size='tiny' floated='right'/> :
                        <Image src={profile} rounded size='tiny' floated='right'/>}
                    <Button className={classes.offer__button} animated onClick={showUser}>
                        <Button.Content visible>{offer.user.email}</Button.Content>
                        <Button.Content hidden>
                            {t("seeDetails")}
                        </Button.Content>
                    </Button>


                </Card.Header>
                {opinion &&
                    <Segment className={classes.rating__segment}>
                        <Rating maxRating={5} icon='star' size='huge' rating={opinion.rating}
                                disabled />
                        {opinion.content &&
                            <Card.Content className={classes.opinion__content}>{opinion.content}</Card.Content>}
                    </Segment>
                }
                <Button onClick={deleteOpinionHandler} className={classes.offer__button}>Usuń opinię</Button>
            </Card.Content>
        </Card>)}
    </section>);
};

export default OfferItem;