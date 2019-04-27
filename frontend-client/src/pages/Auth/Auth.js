import React from 'react';
import  classes from './Auth.module.scss';

const Auth=(props)=>(<div className={classes.Auth}>{props.children}</div>);

export default Auth;