import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../utility';

const initialState = {
    myTeams: null,
    error: null,
    selectedTeam: null,
    loading: false,
    createTeamData: null,
    chatType: null,
    openedChat: null,
    messages: [],
    myState: 'offline',
    unread: [],
    teamUnread: []
};

const getUpdateUnreadMessage = (state, action) => {
    let updateUnread = state.unread.slice();
    updateUnread[action.data.senderId] = action.data.number;
    return updateObject(state, {unread: updateUnread});
};

const changeSeenMess = (state, action) => {
    let updateMessages = state.messages.slice();
    updateMessages.forEach(item => {
        if (item.seenTime == null) {
            item.seenTime = new Date();
        }
    });
    return updateObject(state, {messages: updateMessages});
};

const getUpdateTeamUnreadMessage = (state, action) => {
    let updateUnread = state.teamUnread.slice();
    updateUnread[action.data.teamid] = action.data.number;
    return updateObject(state, {teamUnread: updateUnread});
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

const onLogout = (state, action) => {
    return updateObject(state, {
        myTeams: null,
        error: null,
        selectedTeam: null,
        loading: false,
        createTeamData: null,
        chatType: null,
        openedChat: null,
        messages: null,
        myState: 'offline'
    });
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

//after received changing state
const receiveChangeState = (state, action) => {
    const select=Object.assign({},state.selectedTeam);
    let teamUsers = select.teamUsers;
    teamUsers.forEach(item => {
        if (item.user.id === action.userId) {
            item.user.focu.state = action.state;
        }
    });
    select.teamUsers = teamUsers;
    return updateObject(state, {selectedTeam: select});
};

//Za chat
const sendMessage = (state, action) => {
    const messages = [
        ...state.messages,
        action.message
    ];
    return updateObject(state, {
        messages: messages
    })
};

const loadMoreMessageUserStart = (state, action) => {
    return updateObject(state, {
        loading: true
    })
};


const loadMoreMessageUserSuccess = (state, action) => {
    const messages = [
        ...action.messages,
        ...state.messages
    ];
    return updateObject(state, {
        loading: false,
        messages: messages
    })
};


const loadMoreMessageUserFailed = (state, action) => {
    return updateObject(state, {
        loading: false
    })
};


const openedChat = (state, action) => {
    return updateObject(state, {
        chatType: action.typeChat,
        openedChat: action.select,
        messages: action.messages
    })
};

const receiveMessage = (state, action) => {
    const messages = [
        ...state.messages,
        action.message
    ];
    return updateObject(state, {
        messages: messages
    })
};

const changeMyState = (state, action) => {
    updateObject(state, {
        myState: action.state
    })
};

const setSeenOnMessage = (state, action) => {
    let updateUnread = state.unread.slice();
    updateUnread[action.senderid] = 0;
    return updateObject(state, {unread: updateUnread});
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
            return startSelectedTeam(state, action);
        case actionTypes.TEAM_SELECTED_SUCCESS:
            return selectedTeamSuccess(state, action);
        case actionTypes.TEAM_SELECTED_FAILED:
            return selectedTeamFailed(state, action);
        case actionTypes.OPENED_CHAT:
            return openedChat(state, action);
        case actionTypes.CHANGE_MY_STATE:
            return changeMyState(state, action);
        case actionTypes.SEND_MESSAGE:
            return sendMessage(state, action);
        case actionTypes.RECEIVE_MESSAGE:
            return receiveMessage(state, action);
        case actionTypes.AUTH_LOGOUT:
            return onLogout(state, action);
        case actionTypes.CHECK_UNREAD_MESSAGE:
            return getUpdateUnreadMessage(state, action);
        case actionTypes.SET_SEEN_USER_MESSAGE:
            return setSeenOnMessage(state, action);
        case actionTypes.CHECK_UNREAD_TEAM_MESSAGE:
            return getUpdateTeamUnreadMessage(state, action);
        case actionTypes.LOAD_MORE_MESS_USER_SUCCESS:
            return loadMoreMessageUserSuccess(state, action);
        case actionTypes.LOAD_MORE_MESS_USER_FAILED:
            return loadMoreMessageUserFailed(state, action);
        case actionTypes.LOAD_MORE_MESS_USER_START:
            return loadMoreMessageUserStart(state, action);
        case actionTypes.CHANGE_SEEN_USER_MESS:
            return changeSeenMess(state, action);
        case actionTypes.RECEIVE_CHANGE_STATE:
            return receiveChangeState(state, action);
        default:
            return state;
    }
};
export default reducer;
