import React from 'react';
import classes from './CommandButton.module.scss';
import {Button} from 'antd'


const CommandButton=(props)=>{

   return(
       <div className={classes.CommandButton}>
           <Button type="primary" onClick={props.start}>Start</Button>
           <Button type="primary" onClick={props.start}>Pause</Button>
           <Button type="primary" onClick={props.start}>Reset</Button>
       </div>

   ) ;
};

export default  CommandButton;