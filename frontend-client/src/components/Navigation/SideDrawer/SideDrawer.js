import React from 'react';
import Logo from '../../Logo/Logo';
import NavigationItems from '../Navigation'
import classes from './SideDrawer.module.scss';
import Backdrop from '../../UI/Backdrop/Backdrop';

const sideDrawer = (props) => {
    let attachedClasses=[classes.SideDrawer, classes.Close];
    if(props.open){
        attachedClasses=[classes.SideDrawer, classes.Open];
    }
    return (
      <div>
          <Backdrop clicked={props.closed} show={props.open}/>
            <div className={attachedClasses.join(' ')}>
                <div className={classes.Logo}>
                    <Logo ></Logo>
                </div>
                <nav>
                    <NavigationItems
                        drawer={true}
                        logout={props.logout}
                        isAuthenticated={props.isAuth}
                        user={props.user}
                    >
                    </NavigationItems>
                </nav>
            </div>
       </div>
    );
};

export default sideDrawer;