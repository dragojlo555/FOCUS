import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../utility';

const initialState = {
    token:null,
    userId:null,
    error:null,
    user:null,
    loading:false,
    afterSignUp:false,
    socket:null
};

const signUpFailed=(state,action)=>{
    return updateObject(state,{error:action.error});
};

const authStart=(state,action)=>{
    return updateObject(state,{error:null,loading:true})
};

const afterSignUp=(state,action)=>{
  return updateObject(state,{afterSignUp:false});
};

const authFail=(state,action)=>{
  return updateObject(state,{
      loading:false,
      error:action.error
  })
};

const authSuccess= (state,action) =>{
  return updateObject(state,{
      token:action.token,
      userId:action.userId,
      error:null,
      loading: false,
      user:action.user,
      socket:action.socket
  })
};

const editProfileSuccess=(state,action)=>{
return updateObject(state,{user:action.user});
};
/*
const editProfileFailed=(state,action)=>{

};*/

const authLogout =(state,action)=>{
  return updateObject(state,{token:null,userId:null,socket:null});
};

const signUp=(state,action)=>{
  return updateObject(state,{afterSignUp: true});
};

const reducer = (state= initialState,action)=>{
  switch (action.type) {
      case actionTypes.AUTH_START:return authStart(state,action);
      case actionTypes.AUTH_SUCCESS:return authSuccess(state,action);
      case actionTypes.AUTH_FAIL:return authFail(state,action);
      case actionTypes.AUTH_LOGOUT:return authLogout(state,action);
      case actionTypes.SIGN_UP:return signUp(state,action);
      case actionTypes.AFTER_SIGN_UP:return afterSignUp(state,action);
      case actionTypes.SIGN_UP_FAILED:return signUpFailed(state,action);
      case actionTypes.EDIT_PROFILE_SUCCESS:return editProfileSuccess(state,action);
      default: return state;
  }
};

export default reducer;
