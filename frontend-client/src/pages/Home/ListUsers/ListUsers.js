import React, {Component} from 'react';
import * as actions from "../../../store/actions/index";
import {connect} from "react-redux";
import {Badge, Avatar,} from "antd";
import {URL, DEFAULT_USER_AVATAR, DEFAULT_TEAM_AVATAR} from '../../../axios-conf';
import classes from './ListUsers.module.scss';

class ListUsers extends Component {

    changeState=(data)=>{
        if(this.props.selectedTeam!==null)
        this.props.onSelectedTeam(this.props.token,this.props.selectedTeam.team.id,false);
    };

    componentDidMount() {
        this.props.socket.on('change-state',this.changeState);
        this.props.selectedTeam?console.log(this.props.selectedTeam.teamUsers[0]):console.log('null');
    }

    componentWillUnmount() {
        this.props.socket.off('change-state');
    }

    onSelectUser=(user)=>{
        this.setState({selectedUser:user});
        this.props.onOpen('user',user,this.props.userId,this.props.token);
    };

    onSelectTeamChat=(team)=>{
        this.props.onOpen('team',team,this.props.userId,this.props.token);
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.selectedTeam==null && this.props.selectedTeam!=null) {
            this.props.selectedTeam.teamUsers.map((value, key) => {
                return this.props.onCheckUnread(this.props.token, value.user.id);
            });
        }
          if(prevProps.selectedTeam!=null && this.props.selectedTeam.team.id!==prevProps.selectedTeam.team.id) {
              this.props.selectedTeam.teamUsers.map((value, key) => {
                  return this.props.onCheckUnread(this.props.token, value.user.id);
              });
          }

    }

    render() {
        const users = this.props.selectedTeam != null ? this.props.selectedTeam.teamUsers.map((value, key) => {
            let userClass=classes.UserCard;
            let status=value.user.focu.state==='work'?'error':value.user.focu.state!=='pause'?'success':'warning';
                if(this.props.chatType==='user' && this.props.openedChat.id===value.user.id){
                    userClass = [classes.UserCard, classes.SelectedUserCard].join(' ');
                }
            return <div onClick={()=>{this.onSelectUser(value.user)}} key={value.user.id} className={userClass}><Badge count={this.props.unread[value.user.id]} >
                <Avatar shape="square" src={value.user.Avatar?URL + value.user.Avatar:DEFAULT_USER_AVATAR}/>
            </Badge><span style={{marginLeft:'10px'}}>{value.user.firstName + ' ' + value.user.lastName}</span>
            </div>
        }) : null;
        return (
            <div className={classes.ListUsers}>
                <div onClick={()=>{this.onSelectTeamChat(this.props.selectedTeam.team)}} className={classes.HeaderList}><Avatar src={DEFAULT_TEAM_AVATAR}/>{this.props.selectedTeam?this.props.selectedTeam.team.name:'Name'}</div>
                {users}
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        loading: state.team.loading,
        userId:state.auth.userId,
        isAuthenticated: state.auth.token != null,
        token: state.auth.token,
        openedChat: state.team.openedChat,
        chatType: state.team.chatType,
        selectedTeam: state.team.selectedTeam,
        socket: state.auth.socket,
        unread:state.team.unread
    }
};
const mapDispatchToProps = dispatch => {
    return {
        onGetMyTeams: (token) => dispatch(actions.getMyTeams(token)),
        onOpen:(type,select,homeId,token)=>dispatch(actions.openChat(type,select,homeId,token)),
        onSelectedTeam:(token,id,openChat)=>dispatch(actions.selectedTeam(token,id,openChat)),
        onCheckUnread:(token,senderid)=>dispatch(actions.getUnreadMessage(token,senderid))
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(ListUsers);