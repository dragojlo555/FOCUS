import React from 'react';
import classes from './Toolbar.module.scss';
import Logo from '../../Logo/Logo';
import Navigation from '../Navigation';
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle'

const toolbar=(props)=>(

    <header className={classes.Toolbar}>
        <DrawerToggle clicked={props.drawerToogleClicked}/>
        <div  className={classes.Logo}>
            <Logo/>
        </div>
        <span style={{color:'white',fontSize:'2em',fontWeight:'bold'}}>Focus</span>
        <nav className={classes.DesktopOnly}>
            <Navigation
                logout={props.logout}
                user={props.user}
                isAuthenticated={props.isAuth}
            />
        </nav>
    </header>
);

export default toolbar;