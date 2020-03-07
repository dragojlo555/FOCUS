import React from 'react';
import CustomCircular from '../CustomCircularProgressBar/CustomCircularProgessBar';
import classes from './CircularProgressBar.module.scss'
import {Icon} from 'antd';
const CircularProgressBar = (props) => {
    const duration=props.duration[props.session.current];
    const percentage = props.session.time/(duration*60)*100;
    let minute=parseInt(props.session.time/60);
    let sec=props.session.time%60;
    minute= ("0" + minute).slice(-2);
    sec=("0"+sec).slice(-2);
    let color='#ff452a';
    if(props.session.current==='pause'){color='orange'}else if(props.session.current==='break')color='lime';
    return (
        <div className={classes.CircularProgressBar}>
            <CustomCircular  percentage={percentage}  styles={{
                // Customize the root svg element
                root: {
                    fill:'volcano'
                },
                // Customize the path, i.e. the "completed progress"
                path: {
                    // Path color
                    stroke: color,
                    // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                    strokeLinecap: 'round',
                    // Customize transition animation
                    transition: 'stroke-dashoffset 0.5s ease 0s',
                    // Rotate the path
                 //   transform: 'rotate(0.25turn)',
                    transformOrigin: 'center center',
                },
                // Customize the circle behind the path, i.e. the "total progress"
                trail: {
                    // Trail color
                    stroke: '#e9e9ee',
                    // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                    strokeLinecap: 'round',
                    // Rotate the trail
                    //transform: 'rotate(0.25turn)',
                   // transformOrigin: 'center center',
                },
                // Customize the text
                text: {
                    // Text color
                    fill: '#f88',
                    // Text size
                    fontSize: '16px',
                },
                // Customize background - only used when the `background` prop is true
                background: {
                    fill: '#3e98c7',
                },
            }} >
                <div className={classes.InnerText}>
                    <strong>{props.session.current}  #{props.session.number}</strong>
                    <p className={classes.TimeText}>{minute}:{sec}</p>
                    <Icon className={classes.TimerIcon} onClick={props.start} title='start' type="caret-right"  style={{fontSize:'28px'}} />
                    <Icon className={classes.TimerIcon} onClick={props.pause} type="pause"   style={{fontSize:'28px'}}/>
                    <Icon className={classes.TimerIcon} onClick={props.control} title='control' type="setting"  style={{fontSize:'28px'}} />
                </div>
            </CustomCircular>
        </div>

    )
};


export default CircularProgressBar;