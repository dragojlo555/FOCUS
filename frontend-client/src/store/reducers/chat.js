import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../utility';


const initialState = {
        chatType:null,
        openedChat:null,
        myState:'offline'
};


const openChat=(state,action)=>{
    return updateObject(state,{
            chatType: action.typeChat,
            openedChat:action.select
    })
};

const changeMyState=(state,action)=>{
    updateObject(state,{
        myState:action.state
    })
};

const reducer = (state= initialState,action)=>{
    switch (action.type) {
        case actionTypes.OPEN_CHAT:return openChat(state,action);
        case actionTypes.CHANGE_MY_STATE:return changeMyState(state,action);
        default: return state;
    }
};

export default reducer;