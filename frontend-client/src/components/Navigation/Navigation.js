import React,{Fragment} from 'react';
import NavigationItem from './NavigationItem/NavigationItem';
import classes from './Navigation.module.scss';


const navigationItems = (props) => {

    let component=null;
    if(props.isAuthenticated){
        component=<Fragment>
            <NavigationItem link="/" exact>Home</NavigationItem>
            <NavigationItem link='/teams'>Teams</NavigationItem>
            <NavigationItem link='/logout'>Logout</NavigationItem>
                </Fragment>
    }else{
        component=<Fragment>
            <NavigationItem exact link='/'>Log In</NavigationItem>
            <NavigationItem link='/signup'>Sign Up</NavigationItem>
        </Fragment>
    }

    return(
        <ul className={classes.Navigation}>
            {component}
        </ul>
        )

};
//exact postavljeno da ne kupi NavLink da su oba aktivna
export default navigationItems;