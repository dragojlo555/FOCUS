import React from 'react';
import classes from './Button.module.scss';
import {Link} from 'react-router-dom';

const button=(props)=>
    !props.link?(
       <button
           className={classes.button}
           onClick={props.onClick}
           disabled={props.disabled || props.loading}
           type={props.type}
       >
           {props.loading? 'Loading...': props.children}
       </button>
    ):(
        <Link
            className={[classes.button].join(' ')}
        to={props.link}
        >
            {props.children}
        </Link>
);


export default button;