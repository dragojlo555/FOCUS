import * as actionTypes from './actionTypes';
import axios from '../../axios-conf';

export const getTeamsSuccess = (data) => {
    return {
        type: actionTypes.GET_MY_TEAMS_SUCCESS,
        myTeams: data,
        error: null,
    };
};


export const getTeamsFailed = (error) => {
    return {
        type: actionTypes.GET_MY_TEAMS_FAILED,
        error: error,
        loading: false
    };
};


export const createTeamStart = () => {
    return {
        type: actionTypes.START_CREATE_TEAM
    }
};

export const createTeamSuccess = (data) => {
    return {
        data:data,
        type: actionTypes.SUCCESS_CREATE_TEAM,
    }
};

export const createTeamFailed = (error) => {
    return {
        error:error,
        type: actionTypes.FAILED_CREATE_TEAM,
    }
};

export const createTeamEnd = ()=>{
    return{
        type:actionTypes.END_CREATE_TEAM
    }
};

export const createTeam = (name, img, token) => {
    return dispatch => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('image', img);
        let url = 'team/create';
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
        console.log(token, name);
        axios(options).then(response => {
           // console.log(response.data);
             dispatch(createTeamSuccess(response.data));
        }).catch(err => {
            //console.log(err);
             dispatch(createTeamFailed(err.data));
        });

    }
};




export const selectedTeam=(token,id)=>{
    return dispatch=>{
        dispatch(selectedTeamStart());
        const data={
         idteam:id
        };
        const url='team';
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
            dispatch(selectedTeamSuccess(response.data));
        }).catch(err=>{
            dispatch(selectedTeamFailed(err.data));
        });
    }
};

export const selectedTeamSuccess=(data)=>{
  return{
        type:actionTypes.TEAM_SELECTED_SUCCESS,
        data:data
  }
};

export const selectedTeamStart=()=>{
    return{
        type:actionTypes.TEAM_SELECTED_START,
    }
};

export const selectedTeamFailed=(error)=>{
  return{
      type:actionTypes.TEAM_SELECTED_FAILED,
      error:error
  }
};

export const getMyTeams = (token) => {
    return dispatch => {
        const data = {};
        let url = 'team/myteams';
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
            dispatch(getTeamsSuccess(response.data.data));
        }).catch(err => {
            dispatch(getTeamsFailed(err.data));
        });
    }
};