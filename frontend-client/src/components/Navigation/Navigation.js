import React,{Fragment} from 'react';
import NavigationItem from './NavigationItem/NavigationItem';
import classes from './Navigation.module.scss';
import {Avatar} from 'antd';
import {DEFAULT_USER_AVATAR,URL} from '../../axios-conf'


const navigationItems = (props) => {

    let component=null;

    if(props.isAuthenticated){
            if(props.user){
                console.log(props.user.firstName);
            }
         let me=props.user?<div className={classes.Me}><Avatar src={props.user.Avatar?URL+props.user.Avatar:DEFAULT_USER_AVATAR}/>{props.user.firstName+' '+props.user.lastName}</div>:null;
        component=<Fragment>
            {me}
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