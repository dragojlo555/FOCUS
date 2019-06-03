import axios from 'axios';

export const URL="http://192.168.1.2:5000/";

const baseURLApi=URL+'api/';
export const DEFAULT_USER_AVATAR=URL+'public/images/no-profile.jpg';
export const DEFAULT_TEAM_AVATAR=URL+'public/images/team_avatar.png';

const instance=axios.create({
    baseURL:baseURLApi
});


export default instance;