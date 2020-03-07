import React, {Component} from 'react';
import * as actions from "../../../store/actions/index";
import {connect} from "react-redux";
import {Badge, Avatar,} from "antd";
import ListUsersHeader from '../../../components/ChatComponent/ListUsersHeader/ListUsersHeader';
import classes from './ListUsers.module.scss';
import {getAvatar} from "../../../axios-conf";

class ListUsers extends Component {

    changeState = (data) => { //receive change state
        if (this.props.selectedTeam !== null) {
            this.props.onReceiveChangeState(data.id,data.focu.state);
        }
    };

    componentDidMount() {
        this.props.socket.on('change-state', this.changeState);
    }

    componentWillUnmount() {
        this.props.socket.off('change-state');
    }

    onSelectUser = (user) => {
        this.setState({selectedUser: user});
        this.props.onOpen('user', user, this.props.userId, this.props.token);
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.selectedTeam == null && this.props.selectedTeam != null) {
            this.props.selectedTeam.teamUsers.map((value, key) => {
                return this.props.onCheckUnread(this.props.token, value.user.id);
            });
        }
        if (prevProps.selectedTeam != null && this.props.selectedTeam.team.id !== prevProps.selectedTeam.team.id) {
            this.props.selectedTeam.teamUsers.map((value, key) => {
                return this.props.onCheckUnread(this.props.token, value.user.id);
            });
        }
    }

    render() {
        const users = this.props.selectedTeam != null ? this.props.selectedTeam.teamUsers.map((value, key) => {
            let userClass = classes.UserCard;
            let status;

            if(new Date(value.user.focu.updatedAt) < new Date(new Date().getTime() - 1000 * 1800)){
                status='default';
            }else{
            switch (value.user.focu.state) {
                case 'work':status='error';break;
                case 'pause':status='warning';break;
                case 'break':status='success';break;
                case 'offline':status='default';break;
                case 'online':status='processing';break;
                default:status='default';
            }}
            if (this.props.chatType === 'user' && this.props.openedChat.id === value.user.id) {
                userClass = [classes.UserCard, classes.SelectedUserCard].join(' ');
            }
            return <div onClick={() => {
                this.onSelectUser(value.user)
            }} key={value.user.id} className={userClass}><Badge count={value.user.id === parseInt(this.props.userId)?0:this.props.unread[value.user.id]}>
                <Avatar shape="square" src={getAvatar(value.user.avatar)}/>
            </Badge>
                <div className={classes.NameUser}>
                <span>{
                    value.user.id !== parseInt(this.props.userId) ?
                        value.user.firstName + ' ' + value.user.lastName : this.props.user.firstName + ' ' + this.props.user.lastName + '(you)'
                }</span>
                    <span>  <Badge className={classes.Badge}
                                   status={status}/>{new Date(value.user.focu.updatedAt) < new Date(new Date().getTime() - 1000 * 1800) ? 'offline' : value.user.focu.state}</span>
                </div>
            </div>
        }) : null;

        return (
            <div className={classes.ListUsers}>
               <ListUsersHeader userId={this.props.userId} token={this.props.token}/>
                {users}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        loading: state.team.loading,
        userId: state.auth.userId,
        isAuthenticated: state.auth.token != null,
        token: state.auth.token,
        openedChat: state.team.openedChat,
        chatType: state.team.chatType,
        selectedTeam: state.team.selectedTeam,
        socket: state.auth.socket,
        unread: state.team.unread,
        user: state.auth.user
    }
};
const mapDispatchToProps = dispatch => {
    return {
        onGetMyTeams: (token) => dispatch(actions.getMyTeams(token)),
        onOpen: (type, select, homeId, token) => dispatch(actions.openChat(type, select, homeId, token)),
        onSelectedTeam: (token, id, openChat) => dispatch(actions.selectedTeam(token, id, openChat)),
        onCheckUnread: (token, senderid) => dispatch(actions.getUnreadMessage(token, senderid)),
        onReceiveChangeState:(userId,state)=>dispatch(actions.receiveChangeState(userId,state))
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(ListUsers);