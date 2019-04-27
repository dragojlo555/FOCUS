import React from 'react';
import classes from './Logo.module.scss';
import logoImg from '../../assets/pomodoro.PNG';

const logo=(props)=>(
    <div className={classes.Logo} style={{height:props.height}}>
        <img src={logoImg} alt="MyFocus"></img>
    </div>

);

export default logo;