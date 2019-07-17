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
        data: data,
        type: actionTypes.SUCCESS_CREATE_TEAM,
    }
};

export const createTeamFailed = (error) => {
    return {
        error: error,
        type: actionTypes.FAILED_CREATE_TEAM,
    }
};

export const createTeamEnd = () => {
    return {
        type: actionTypes.END_CREATE_TEAM
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
        axios(options).then(response => {
            // console.log(response.data);
            dispatch(createTeamSuccess(response.data));
        }).catch(err => {
            //console.log(err);
            dispatch(createTeamFailed(err.data));
        });
    }
};


export const selectedTeam = (token, id, open) => {
    return dispatch => {
        dispatch(selectedTeamStart());
        const data = {
            idteam: id
        };
        const url = 'team';
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
            dispatch(selectedTeamSuccess(response.data));
            if (open === true) {
                dispatch(openChat('team', response.data.team, -1, token));
            }
        }).catch(err => {
            dispatch(selectedTeamFailed(err.data));
        });
    }
};

export const selectedTeamSuccess = (data) => {
    return {
        type: actionTypes.TEAM_SELECTED_SUCCESS,
        data: data
    }
};

/*
export const teamAfterLogout=()=>{
    return{
        type:actionTypes.TEAM_AFTER_LOGOUT
    }
}
;*/

export const selectedTeamStart = () => {
    return {
        type: actionTypes.TEAM_SELECTED_START,
    }
};

export const selectedTeamFailed = (error) => {
    return {
        type: actionTypes.TEAM_SELECTED_FAILED,
        error: error
    }
};

export const getMyTeams = (token) => {
    return dispatch => {
        const data = {};
        let url = 'team/myteams';
        let options = {
            method: 'GET',
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

export const openedChat = (typeChat, select, messages) => {
    const sortMessages = messages.slice().sort((a, b) => a.id - b.id);
    return {
        type: actionTypes.OPENED_CHAT,
        typeChat: typeChat,
        select: select,
        messages: sortMessages
    }
};

//chat action
export const openChat = (type, select, homeId, token) => {
    return dispatch => {
        const data = {
            receivedid: homeId,
            senderid: select.id
        };
        let url = type === 'user' ? 'chat/user' : 'chat/team';
        let options = {
            method: 'GET',
            url: url,
            params: data,
            headers: {
                'Authorization': `bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        };
        axios(options).then(response => {
            dispatch(openedChat(type, select, response.data.message));
        }).catch(err => {
            console.log(err);
        });
    }
};

export const loadMoreMessageUserSuccess=(messages)=>{
    const sortMessages = messages.slice().sort((a, b) => a.id - b.id);
        return{
            type:actionTypes.LOAD_MORE_MESS_USER_SUCCESS,
            messages:sortMessages
        }
};

export const loadMoreMessageUserFailed=()=>{
  return{
      type:actionTypes.LOAD_MORE_MESS_USER_FAILED,
  }
};

export const loadMoreMeessageUserStart=()=>{
  return{
      type:actionTypes.LOAD_MORE_MESS_USER_START
  }
};


export const loadMoreMessageUser = (token, senderid, lastid,type) => {
    return dispatch => {
        dispatch(loadMoreMeessageUserStart());
        const data = {
            senderid: senderid,
            lastid:lastid
        };
        const url=(type==='user')?'chat/user/load':'chat/team/load';
        let options = {
            method: 'GET',
            url: url,
            params: data,
            headers: {
                'Authorization': `bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        };
        axios(options).then(response => {
           // console.log(response.data);
         //   dispatch(loadMoreMessageUserSuccess(response.data.messages));
            setTimeout(()=>{dispatch(loadMoreMessageUserSuccess(response.data.messages));},2000);
        }).catch(err => {
             dispatch(loadMoreMessageUserFailed());
          //  console.log(err);
        });
    }
};


export const changeMyStateFinsished = (state) => {
    return {
        type: actionTypes.CHANGE_MY_STATE,
        state: state
    }
};

export const sendMessage = (message) => {
    return {
        type: actionTypes.SEND_MESSAGE,
        message: message
    }
};

export const receiveMessage = (message) => {
    return {
        type: actionTypes.RECEIVE_MESSAGE,
        message: message
    }
};

export const getUnreadMessageUserSuccess = (data) => {
    return {
        type: actionTypes.CHECK_UNREAD_MESSAGE,
        data: data
    }
};

export const setSeenMessageUserSuccess = (senderId) => {
    return {
        type: actionTypes.SET_SEEN_USER_MESSAGE,
        senderid: senderId
    }
};


export const getUnreadMessage = (token, senderid) => {
    return dispatch => {
        const data = {
            senderid: senderid
        };
        const url = 'chat/user/seen';
        let options = {
            method: 'GET',
            url: url,
            params: data,
            headers: {
                'Authorization': `bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        };
        axios(options).then(response => {
            dispatch(getUnreadMessageUserSuccess(response.data));
        }).catch(err => {
            // dispatch(selectedTeamFailed(err.data));
            console.log(err);
        });
    }
};

export const getUnreadTeamMessageSuccess = (data, teamid) => {
    if (teamid === null) {
        return {
            type: actionTypes.CHECK_UNREAD_TEAM_MESSAGE,
            data: data
        }
    } else {
        const myData = {
            teamid: teamid,
            number: 0
        };
        return {
            type: actionTypes.CHECK_UNREAD_TEAM_MESSAGE,
            data: myData
        }
    }
};


export const getUnreadTeamMessage = (token, teamid) => {
    return dispatch => {
        const data = {
            teamid: teamid
        };
        const url = 'chat/team/seen';
        let options = {
            params: data,
            method: 'GET',
            url: url,
            headers: {
                'Authorization': `bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        };
        axios(options).then(response => {
            dispatch(getUnreadTeamMessageSuccess(response.data, null));
        }).catch(err => {
            // dispatch(selectedTeamFailed(err.data));
            console.log('Unread error', err.response);
        });
    }
};

export const setSeenTeamMessage = (token, teamid) => {
    return dispatch => {
        const data = {
            teamid: teamid
        };
        const url = 'chat/team/seen';
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
            dispatch(getUnreadTeamMessageSuccess({}, teamid));
        }).catch(err => {
            console.log(err);
        });
    }


};


export const setSeenMessage = (token, senderid) => {
    return dispatch => {
        const data = {
            senderid: senderid
        };
        const url = 'chat/user/seen';
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
            dispatch(setSeenMessageUserSuccess(response.data.senderid));
        }).catch(err => {
            // dispatch(selectedTeamFailed(err.data));
            console.log(err);
        });
    }
};


export const changeMyState = (token, state) => {
    return dispatch => {
        const data = {
            state: state
        };
        const url = 'users/focus';
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
            dispatch(changeMyStateFinsished(state));
        }).catch(err => {
            // dispatch(selectedTeamFailed(err.data));
            // console.log(err);
        });
    }
};

