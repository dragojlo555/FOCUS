import * as actionTypes from './actionTypes';
import axios from '../../axios-conf';
import {init, close} from '../../confSocketIO';
import Cokkies from 'js-cookie';


export const start=()=>{
  return{
    type:actionTypes.START
  }
};

export const changeSounds =()=>{
  return{
   type:actionTypes.CHANGE_SOUNDS
  }
};


export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (token, userId, user) => {
    localStorage.setItem('token',token);
    localStorage.setItem('userId',userId);
    const socket = init(token, userId);
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        userId: userId,
        user: user,
        socket: socket
    }
};

export const afterSignUp = () => {
    return {
        type: actionTypes.AFTER_SIGN_UP
    }
};

export const authFail = (error,email) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error,
        email:email
    }
};

export const signUpSuccess = () => {
    return {
        type: actionTypes.SIGN_UP
    }
};

export const signUpFailed = (error) => {
    return {
        type: actionTypes.SIGN_UP_FAILED,
        error: error
    }
};

export const logout = () => {
    close();
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');

    return {
        type: actionTypes.AUTH_LOGOUT
    }
};

export const editProfileSuccess = (user) => {
    return {
        type: actionTypes.EDIT_PROFILE_SUCCESS,
        user: user
    }
};

export const resetPomodoro = () => {
    return {
        type: actionTypes.RESET_POMODORO
    }
};

export const checkAuthTimeout = (expireTime) => {
    let newTime = expireTime * 1000;
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, newTime);
    };
};

export const auth = (email, password) => {
    return dispatch => {
        dispatch(authStart());
        const data = {
            email: email,
            password: password
        };
        let url = 'users/login';
        let options = {
            method: 'POST',
            url: url,
            data: data,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        };
        axios(options).then(response => {
                if (response.status === 200) {
                    const expirationTime = new Date(new Date().getTime() + response.data.expireIn * 1000 * 3600);
                    localStorage.setItem('expirationDate', expirationTime);
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('userId', response.data.userId);
                    dispatch(resetPomodoro());
                    dispatch(authSuccess(response.data.token, response.data.userId, response.data.user));
                    dispatch(checkAuthTimeout(response.data.expireIn * 3600));
                }
            }
        ).catch(err => {
                dispatch(authFail(err.response,email));
            }
        );
    }
};

export const signUp = (email, password, firstname, lastname, img, phone) => {
    return dispatch => {
        const url = 'users/create';
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('firstname', firstname);
        formData.append('lastname', lastname);
        formData.append('image', img);
        formData.append('phone', phone);
        let options = {
            method: 'POST',
            url: url,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };
        axios(options).then(response => {
            dispatch(signUpSuccess());
        }).catch(error => {
                dispatch(signUpFailed(error.response));
            }
        );
    }
};

export const editProfileAvatar = (token, firstname, lastname, phone, avatar) => {
    return dispatch => {
        const url = 'users/changeprofileavatar';
        const formData = new FormData();
        formData.append('firstname', firstname);
        formData.append('lastname', lastname);
        formData.append('image', avatar);
        formData.append('phone', phone);
        let options = {
            method: 'POST',
            url: url,
            data: formData,
            headers: {
                'Authorization': `bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        };
        axios(options).then(response => {
            dispatch(editProfileSuccess(response.data.user));
        }).catch(error => {
                //  dispatch(signUpFailed(error.response));
               // console.log(error.response.data);
            }
        )

    }
};

export const resendVerificationMail = (mail) => {
    return dispatch => {
        const url = 'users/resendverification';
        const data = {
          mail:mail
        };
        let options = {
            method: 'GET',
            url: url,
            params: data,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        };
        axios(options).then(response => {
           // dispatch(editProfileSuccess(response.data.user));
        }).catch(error => {
                //  dispatch(signUpFailed(error.response));
            }
        )

    }
};



export const editProfile = (token, firstname, lastname, phone) => {
    return dispatch => {
        const url = 'users/changeprofile';
        const data = {
            firstname: firstname,
            lastname: lastname,
            phone: phone
        };

        let options = {
            method: 'POST',
            url: url,
            data: data,
            headers: {
                'Authorization': `bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        };
        axios(options).then(response => {
            dispatch(editProfileSuccess(response.data.user));

        }).catch(error => {
                //  dispatch(signUpFailed(error.response));
              //  console.log(error.response.data);
            }
        )

    }
};

export const authCheckState = () => {
    return dispatch => {
        let token = localStorage.getItem('token');
        let cookieExpire=false;
        if(!token){
            cookieExpire=true;
            token=Cokkies.get('token');
           Cokkies.remove('token');
        }
        if (!token) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date() && cookieExpire===false) {
                dispatch(logout());
            } else {
                const url = 'users/info';
                let options = {
                    method: 'GET',
                    url: url,
                    headers: {
                        'Authorization': `bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                };
                axios(options).then(response => {
                    const expirationTime = new Date(new Date().getTime() + 1000 * 3600);
                    localStorage.setItem('expirationDate', expirationTime);
                    dispatch(authSuccess(token, response.data.user.id, response.data.user));
                    dispatch(checkAuthTimeout((expirationTime.getTime() - new Date().getTime()) / 1000));
                }).catch(error => {
                    dispatch(logout());
                });
            }
        }
    };
};


