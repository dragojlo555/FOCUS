import * as actionTypes from './actionTypes';
import axios from "../../axios-conf";
//import axios from '../../axios-conf';


export const openChat=(typeChat,select)=>{
return{
    type:actionTypes.OPEN_CHAT,
    typeChat:typeChat,
    select:select,
}
};

export const changeMyStateFinsished=(state)=>{
  return{
      type:actionTypes.CHANGE_MY_STATE,
      state:state
  }
};

export const changeMyState=(token,state)=>{
    return dispatch=>{
    const data={
       state:state
    };
    const url='users/focus';
    let options={
        method:'POST',
        url:url,
        data:data,
        headers:{
            'Authorization': `bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        }
    };
    axios(options).then(response =>{
        dispatch(changeMyStateFinsished(state));
    }).catch(err=>{
       // dispatch(selectedTeamFailed(err.data));
       // console.log(err);
    });
}
};

