import axios from 'axios';

export const URL="http://localhost:5000/";
export const URLT=URL;
const baseURLApi=URL+'api/';
export const DEFAULT_USER_AVATAR=URL+'public/images/no-profile.jpg';
export const DEFAULT_TEAM_AVATAR=URL+'public/images/team_avatar.png';

const instance=axios.create({
    baseURL:baseURLApi
});

export default instance;