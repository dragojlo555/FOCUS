import React from 'react';
import CustomCircular from '../CustomCircularProgressBar/CustomCircularProgessBar';
import classes from './CircularProgressBar.module.scss'

const CircularProgressBar = (props) => {
    const duration=props.duration[props.session.current];
    const percentage = props.session.time/(duration*60)*100;
    let minute=parseInt(props.session.time/60);
    let sec=props.session.time%60;
    minute= ("0" + minute).slice(-2);
    sec=("0"+sec).slice(-2);
    return (
        <div className={classes.CircularProgressBar}>
            <CustomCircular percentage={percentage}>
                <div className={classes.InnerText}>
                    <strong>{props.session.current}  #{props.session.number}</strong>
                    <p className={classes.TimeText}>{minute}:{sec}</p>
                </div>
            </CustomCircular>
        </div>

    )


};


export default CircularProgressBar;