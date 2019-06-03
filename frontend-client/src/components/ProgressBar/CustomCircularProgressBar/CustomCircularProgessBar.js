import React from "react";
import CircularProgressbar from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import classes from './CustomCircularProgressBar.module.scss';

const CustomContentProgressbar = (props) => {
    const {children, ...otherProps} = props;
    return (
        <div className={classes.CustomContentProgressBar}>
            <div className={classes.Bar}>
                <CircularProgressbar  {...otherProps}  />
            </div>
            <div className={classes.Children}>
                {props.children}
            </div>
        </div>
    );
};
export default CustomContentProgressbar;
