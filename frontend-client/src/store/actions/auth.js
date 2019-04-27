import * as actionTypes from './actionTypes';
import axios from '../../axios-conf';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        userId: userId
    }
};

export const afterSignUp = ()=>{
  return {
        type:actionTypes.AFTER_SIGN_UP
  }
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
};

export const signUpSuccess=()=>{
    return{
        type:actionTypes.SIGN_UP
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    localStorage.removeItem('timer');
    return {
        type: actionTypes.AUTH_LOGOUT
    }
};

export const checkAuthTimeout = (expireTime) => {
   let newTime=expireTime*1000;
    return dispatch => {
        setTimeout(() => {
          dispatch(logout());
        }, newTime);
    };
};

export const auth = (email, password) => {
    return dispatch => {
        dispatch(authStart());
        const data= {
            email: email,
            password: password
        };
        let url='users/login';
        let options={
            method:'POST',
            url:url,
            data:data,
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        };
         axios(options).then(response=> {
                if(response.status===200){
                    const expirationTime=new Date(new Date().getTime()+response.data.expireIn*1000*3600);
                    localStorage.setItem('expirationDate',expirationTime);
                    localStorage.setItem('token',response.data.token);
                    localStorage.setItem('userId',response.data.userId);
                    dispatch(authSuccess(response.data.token,response.data.userId));
                    dispatch(checkAuthTimeout(response.data.expireIn*3600));
                }
            }
        ).catch(err=>{
             dispatch(authFail(err.response));
            console.log('Error')}
        );
    }
};

export const signUp=(email,password,firstname,lastname,img)=>{
    return dispatch=>{
        console.log(email,password,firstname,lastname,img);
        const url='users/create';
        const formData=new FormData();
        formData.append('email',email);
        formData.append('password',password);
        formData.append('firstname',firstname);
        formData.append('lastname',lastname);
        formData.append('image',img);
        let options={
            method:'POST',
            url:url,
            data:formData,
            headers:{
                'Content-Type': 'multipart/form-data'
            }
        };
        axios(options).then(response=>{
            console.log(response);
            dispatch(signUpSuccess());
        }).catch(error=>{
            console.log(error.response);
            }
        )
    }
};


export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date()) {
                dispatch(logout());
            } else {
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess(token, userId));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime())/1000));
            }
        }

    };
};


