import React, {Component} from 'react';
import classes from './Chat.module.scss'
import {connect} from 'react-redux';
import {Badge} from "antd";
import * as actions from "../../../store/actions";
import Messages from './Messages/Messages';
import InputFieldChat from '../../../components/ChatComponent/InputFieldChat/InputFieldChat';

class Chat extends Component {

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({behavior: "smooth"});
    };


    userMessageHandler = data => {
        this.props.onCheckUnread(this.props.token, data.senderUserId);
        if (data.senderUserId === this.props.openedChat.id && data.receivedUserId === parseInt(this.props.userId)) {
            this.props.onReceiveMessage(data);
            this.props.onSetSeenMessageUser(this.props.token, data.senderUserId);
            this.scrollToBottom();
        } else if (data.senderUserId === parseInt(this.props.userId) && data.receivedUserId === this.props.openedChat.id) {
            this.props.onReceiveMessage(data);
            this.scrollToBottom();
        }
    };

    teamMessageHandler = data => {
        this.props.onGetTeamUnread(this.props.token, data.teamid);
        if (this.props.openedChat.id === data.teamid && this.props.chatType==='team') {
            this.props.onReceiveMessage(data);
            this.props.onSeenTeamMessage(this.props.token,data.teamid);
            this.scrollToBottom();
        }
    };

    componentDidMount() {
        this.props.socket.on('user-message-cl-' + this.props.userId, this.userMessageHandler);
        this.scrollToBottom();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.openedChat !== prevProps.openedChat) {
            if (prevProps.openedChat && prevProps.chatType === 'team') {
                this.props.myTeams.forEach((value,key)=>{
                    this.props.socket.off('team-message-cl-' + value.team.id);
                    this.props.socket.on('team-message-cl-' + value.team.id,this.teamMessageHandler);
                });
            }
            if (this.props.chatType === 'team') {
                this.props.myTeams.forEach((value,key)=>{
                    this.props.socket.off('team-message-cl-' + value.team.id);
                    this.props.socket.on('team-message-cl-' + value.team.id,this.teamMessageHandler);
                });
            }
            if (this.props.chatType === 'user') {
                this.props.onSetSeenMessageUser(this.props.token, this.props.openedChat.id);
            }
        }
        this.scrollToBottom();
    }

    componentWillUnmount() {
        this.props.socket.off('user-message-cl-' + this.props.userId);
        this.props.socket.off('team-message-cl-'+this.props.openedChat.id);
        this.props.myTeams.forEach((value,key)=>{
            this.props.socket.off('team-message-cl-' + value.team.id);
            this.props.socket.on('team-message-cl-' + value.team.id);
        });
    }


    sendMessageHandler = (message) => {
        if (message.trim() === '') {
            return;
        }
        let payload = {};
        payload.senderUserId = parseInt(this.props.userId);
        payload.data = {
            content: message,
            type: 'text'
        };
        if (this.props.openedChat !== null) {
            payload.receiverId = this.props.openedChat.id;
            if (this.props.chatType === 'user') {
                this.props.socket.emit('user-message', payload);
            } else {
                this.props.socket.emit('team-message', payload);
            }
        }
    };

    render() {
        let header = this.props.openedChat !== null ? this.props.chatType === 'user' ?
            <div className={classes.UserHeader}><span
                className={classes.UserHeaderName}>{this.props.openedChat.firstName + ' ' + this.props.openedChat.lastName}</span>
                <Badge
                    status={this.props.openedChat.focu.state === 'work' ? 'error' : this.props.openedChat.focu.state === 'pause' ? 'warning' :
                        this.props.openedChat.focu.state==='break'?'success': this.props.openedChat.focu.state==='online'?'processing':'default'}
                    text={this.props.openedChat.focu.state}/></div> :
            <div className={classes.UserHeader}><span
                className={classes.UserHeaderName}>{this.props.openedChat.name}</span><span>#teamchat</span>
            </div> : null;
        return (
            <div className={classes.Chat}>
                <div className={classes.ChatHeader}>
                    {header}
                </div>
                <div className={classes.ChatField}>
                    <div className={classes.MessageField}>
                        <Messages user={this.props.user} messages={this.props.messages}
                                  openedChat={this.props.openedChat} chatType={this.props.chatType}/>
                        <div style={{float: "left", clear: "both"}}
                             ref={(el) => {
                                 this.messagesEnd = el;
                             }}>
                        </div>
                    </div>
                    <InputFieldChat send={this.sendMessageHandler}/>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        selectedTeam: state.team.selectedTeam,
        openedChat: state.team.openedChat,
        chatType: state.team.chatType,
        token: state.auth.token,
        myTeams:state.team.myTeams,
        socket: state.auth.socket,
        userId: state.auth.userId,
        user: state.auth.user,
        messages: state.team.messages
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onChangeMyState: (token, state) => dispatch(actions.changeMyState(token, state)),
        onReceiveMessage: (message) => dispatch(actions.receiveMessage(message)),
        onCheckUnread: (token, senderid) => dispatch(actions.getUnreadMessage(token, senderid)),
        onSetSeenMessageUser: (token, senderid) => dispatch(actions.setSeenMessage(token, senderid)),
        onGetTeamUnread: (token, teamid) => dispatch(actions.getUnreadTeamMessage(token, teamid)),
        onSeenTeamMessage:(token,teamid)=>dispatch(actions.setSeenTeamMessage(token,teamid)),

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);