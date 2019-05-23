import axios from 'axios';

export const URL="http://localhost:5000/";
export const DEFAULT_USER_AVATAR="http://localhost:5000/public/images/no-profile.jpg";
export const DEFAULT_TEAM_AVATAR="http://localhost:5000/public/images/team_avatar.png";

const instance=axios.create({
    baseURL:'http://localhost:5000/api/'
});


export default instance;