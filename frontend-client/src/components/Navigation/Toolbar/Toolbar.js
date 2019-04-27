import React from 'react';
import classes from './Toolbar.module.scss';
import Logo from '../../Logo/Logo';
import Navigation from '../Navigation';
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle'

const toolbar=(props)=>(

    <header className={classes.Toolbar}>
        <DrawerToggle clicked={props.drawerToogleClicked}></DrawerToggle>
        <div  className={classes.Logo}>
            <Logo></Logo>
        </div>
        <nav className={classes.DesktopOnly}>
            <Navigation
                isAuthenticated={props.isAuth}
            ></Navigation>
        </nav>
    </header>
);

export default toolbar;