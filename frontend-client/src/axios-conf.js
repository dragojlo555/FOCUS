import axios from 'axios';
import store from './store/reducers/auth';
import {logout} from "./store/actions";

export const URL = "http://localhost:5000/";
export const URLT = URL;
const baseURLApi = URL + 'api/';
export const DEFAULT_USER_AVATAR = URL + 'public/images/no-profile.jpg';
export const DEFAULT_TEAM_AVATAR = URL + 'public/images/team_avatar.png';


const instance = axios.create({
    baseURL: baseURLApi
});

export const  getAvatar=(avatar)=>{
    return   avatar?avatar.startsWith('http')?avatar:URL +avatar : DEFAULT_USER_AVATAR;
};

const {dispatch} = store;
instance.interceptors.response.use(response => {
    return response;
}, error => {
    const {config,response: {status}} = error;
    if (status === 401) {
        dispatch(logout());
        return Promise.reject(error);
    }
    return Promise.reject(error);
});


export default instance;