import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../utility';

const initialState = {
    myTeams: null,
    error: null,
    selectedTeam: null,
    loading: false,
    createTeamData: null,
};

const getMyTeamsSuccess = (state, action) => {
    return updateObject(state, {
        myTeams: action.myTeams,
        error: null,
        loading: false,
    })
};

const startSelectedTeam = (state, action) => {
    return updateObject(state,
        {loading: true});
};

const selectedTeamSuccess = (state, action) => {
    return updateObject(state,
        {loading: false, selectedTeam: action.data})
};

const selectedTeamFailed = (state, action) => {
    return updateObject(state,
        {loading: false, selectedTeam: null})
};

const getMyTeamsFailed = (state, action) => {
    return updateObject(state, {
        myTeams: [],
        error: action.error,
        loading: false
    })
};

const createTeamSuccess = (state, action) => {
    return updateObject(state, {
        loading: false,
        createTeamData: action.data
    });
};

const createTeamFailed = (state, action) => {
    return updateObject(state, {
        loading: false,
        createTeamData: action.error
    });
};

const createTeamStart = (state, action) => {
    return updateObject(state, {
        loading: true,
        error: null,
        createTeamData: 'start'
    });
};

const endCreateTeam = (state, action) => {
    return updateObject(state, {
        createTeamData: null,
        loading: false
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_MY_TEAMS_SUCCESS:
            return getMyTeamsSuccess(state, action);
        case actionTypes.GET_MY_TEAMS_FAILED:
            return getMyTeamsFailed(state, action);
        case actionTypes.SUCCESS_CREATE_TEAM:
            return createTeamSuccess(state, action);
        case actionTypes.FAILED_CREATE_TEAM:
            return createTeamFailed(state, action);
        case actionTypes.START_CREATE_TEAM:
            return createTeamStart(state, action);
        case actionTypes.END_CREATE_TEAM:
            return endCreateTeam(state, action);
        case actionTypes.TEAM_SELECTED_START:
            return startSelectedTeam(state,action);
        case actionTypes.TEAM_SELECTED_SUCCESS:
            return selectedTeamSuccess(state,action);
        case actionTypes.TEAM_SELECTED_FAILED:
            return selectedTeamFailed(state,action);
        default:
            return state;
    }
};


export default reducer;
