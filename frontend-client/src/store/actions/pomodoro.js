import * as actionTypes from './actionTypes';


export const setPomodoroTimerSession=(session)=>{
    return{
        type:actionTypes.SET_POMODORO_SESSION,
        session:session
    }
};

export const setPomodoroTimerDuration=(duration)=>{
  return{
        type:actionTypes.SET_POMODORO_DURATION,
        duration:duration
  }
};