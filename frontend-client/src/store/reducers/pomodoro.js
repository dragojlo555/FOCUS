import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../utility';


const initialState={
    visible:false,
    duration: {
        work: 10,
        pause: 5,
        break: 30
    },
    session: {
        current: 'work',
        number: 1,
        startTime: null,
        endTime: null,
        time: 0,
        timer: null
    }
};

const setPomodoroTimerDuration=(state,action)=>{
  return updateObject(state,{duration:action.duration});
};

const setPomodoroTimerSession=(state,action)=>{
    return updateObject(state,{session:action.session});
};



const reducer=(state=initialState,action)=>{
    switch (action.type) {
        case actionTypes.SET_POMODORO_DURATION:return setPomodoroTimerDuration(state,action);
        case actionTypes.SET_POMODORO_SESSION:return setPomodoroTimerSession(state,action);
        case actionTypes.AUTH_LOGOUT:return initialState;
        case actionTypes.RESET_POMODORO:return initialState;
        default: return state;
    }
};

export default reducer;
