import {Fragment} from 'react';
import Navigation from "./Navigation";
import {useSelector} from "react-redux";
import {isUserLoggedIn} from "../../store/auth";
import classes from './Layout.module.css';

const Layout = (props) => {
    const isLoggedIn = useSelector(isUserLoggedIn);
    return (
        <Fragment>
            <Navigation/>
            <main>{props.children}</main>
            {isLoggedIn &&
                <footer className={classes.app__footer}>
                    <h4>Services App 2022</h4>
                    <p>
                        <a href="mailto:weronika.kurczyna@gmail.com">weronika.kurczyna@gmail.com</a>
                    </p>
                </footer>
            }
        </Fragment>
    );
};

export default Layout;