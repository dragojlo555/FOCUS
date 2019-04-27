import React from 'react';
import classes from './SetDuration.module.scss'

const SetDuration = (props) => {

    return (
        <div className={classes.SetDuration}>
            <span>{props.label}</span>
            <div className={classes.Setter}>
            <button onClick={props.incDuration} className={[classes.ButtonPlus ,classes.Button].join(' ')}>+</button>
            <span>{props.time}min</span>
            <button onClick={props.decDuration} disabled={props.time>0?false:true} className={[classes.ButtonMinus ,classes.Button].join(' ')}>-</button>
            </div>
        </div>
    )
};

export default SetDuration;