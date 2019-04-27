import React from 'react';
import classes from './CommandButton.module.scss';


const CommandButton=(props)=>{

   return(
       <div className={classes.CommandButton}>
           <button onClick={props.start} className={classes.StartButton}>Start</button>
           <button onClick={props.pause} className={classes.PauseButton}>Pause</button>
           <button onClick={props.reset} className={classes.ResetButton}>Reset</button>
       </div>

   ) ;
};

export default  CommandButton;