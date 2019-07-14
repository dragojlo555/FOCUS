import React from 'react';
import classes from './SetDuration.module.scss'

const SetDuration = (props) => {

    return (
        <div className={classes.SetDuration}>
            <span>{props.label}</span>
            <div className={classes.Setter}>
            <button onClick={props.incDuration} disabled={props.duration===30} className={[classes.ButtonPlus ,classes.Button].join(' ')}>+</button>
            <span>{props.duration}min</span>
                {console.log(props.time/60,props.duration)}
            <button onClick={props.decDuration} disabled={props.duration<=1 || (props.time/60)>=(props.duration-1)} className={[classes.ButtonMinus ,classes.Button].join(' ')}>-</button>
            </div>
        </div>
    )
};

export default SetDuration;