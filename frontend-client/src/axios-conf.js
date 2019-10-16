import axios from 'axios';
export const URL = "http://localhost:5000/";
export const URLT = URL;
const baseURLApi = URL + 'api/';
export const DEFAULT_USER_AVATAR = URL + 'public/images/no-profile.jpg';
export const DEFAULT_TEAM_AVATAR = URL + 'public/images/team_avatar.png';


const instance = axios.create({
    baseURL: baseURLApi
});

instance.interceptors.response.use(response => {
    return response;
}, error => {
    const {config,response: {status}} = error;
    if (status === 401) {
        if(config){}
    }
    return Promise.reject(error);
});


export default instance;