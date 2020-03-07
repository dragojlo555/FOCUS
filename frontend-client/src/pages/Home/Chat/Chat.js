import React, {Component} from 'react';
import classes from './Chat.module.scss'
import {connect} from 'react-redux';
import {Badge, Spin} from "antd";
import recSound from './recsound.mp3';
import countSound from './messcounter.mp3';
import * as actions from "../../../store/actions";
import Messages from './Messages/Messages';
import InputFieldChat from '../../../components/ChatComponent/InputFieldChat/InputFieldChat';
import ImageView from "../../../components/ChatComponent/ImageView/ImageView";
import {Route} from 'react-router-dom';

class Chat extends Component {

    audio = new Audio(recSound);
    countAudio = new Audio(countSound);

    togglePlayAudio = () => {
        this.audio.play();
    };

    togglePlayCount = () => {
        this.countAudio.play();
    };

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({behavior: "smooth"});
    };

    userMessageHandler = data => {
        this.props.onCheckUnread(this.props.token, data.senderUserId);
        if (data.senderUserId === this.props.openedChat.id && data.receivedUserId === this.props.user.id && this.props.chatType === 'user') {
            this.togglePlayAudio();
            this.props.onReceiveMessage(data);
            this.props.onSetSeenMessageUser(this.props.socket,this.props.user.id,data.senderUserId);
            this.scrollToBottom();
        } else if (data.senderUserId === this.props.user.id && data.receivedUserId === this.props.openedChat.id && this.props.chatType === 'user') {
            this.props.onReceiveMessage(data);
            this.scrollToBottom();
        } else {
            this.togglePlayCount();
        }
    };

    userSeenHandler = data => {
        this.props.onChangeSeenMess();
    };

    teamMessageHandler = data => {
        this.props.onGetTeamUnread(this.props.token, data.teamid);
        if (this.props.openedChat.id === data.teamid && this.props.chatType === 'team') {
            this.props.onReceiveMessage(data);
            this.props.onSeenTeamMessage(this.props.token, data.teamid);
            this.scrollToBottom();
            if (this.props.user.id !== data.userid) {
                this.togglePlayAudio();
            }
        }
    };

    loadMoreMessages = () => {
        if (this.props.openedChat && this.props.messages[0] && this.props.loading === false)
            this.props.onLoadMoreMessageUser(this.props.token, this.props.openedChat.id, this.props.messages[0].id, this.props.chatType);
    };

    componentDidMount() {
        this.refs.myscroll.addEventListener("scroll", () => {
            //console.log(this.refs.myscroll.scrollTop,this.refs.myscroll.clientHeight);
            //    console.log(  this.refs.myscroll.scrollHeight)
            if (this.refs.myscroll.scrollTop === 0) {
                this.loadMoreMessages();
            }
        });
        this.props.socket.on('nesto', (data) => {
            console.log(data)
        });
        this.props.socket.on('user-message-cl-' + this.props.user.id, this.userMessageHandler);
        this.props.socket.on('user-seen-' + this.props.user.id, this.userSeenHandler);
        if (this.props.myTeams)
            this.props.myTeams.forEach((value, key) => {
                this.props.socket.off('team-message-cl-' + value.team.id);
                this.props.socket.on('team-message-cl-' + value.team.id, this.teamMessageHandler);
            });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.openedChat !== prevProps.openedChat) {
            if (prevProps.openedChat && prevProps.chatType === 'team') {
                this.props.myTeams.forEach((value, key) => {
                    this.props.socket.off('team-message-cl-' + value.team.id);
                    this.props.socket.on('team-message-cl-' + value.team.id, this.teamMessageHandler);
                });
            }
            if (this.props.chatType === 'team') {
                this.props.myTeams.forEach((value, key) => {
                    this.props.socket.off('team-message-cl-' + value.team.id);
                    this.props.socket.on('team-message-cl-' + value.team.id, this.teamMessageHandler);
                });
            }
            if (this.props.chatType === 'user') {
               // this.props.onSetSeenMessageUser(this.props.token, this.props.openedChat.id);
                this.props.onSetSeenMessageUser(this.props.socket,this.props.user.id,this.props.openedChat.id);
              //  const payload = {userId: this.props.user.id, senderId: this.props.openedChat.id};
               // this.props.socket.emit('user-set-seen', payload);
            }
            this.scrollToBottom();
        }
    }

    componentWillUnmount() {
        this.props.socket.off('user-message-cl-' + this.props.user.id);
        if (this.props.openedChat)
            this.props.socket.off('team-message-cl-' + this.props.openedChat.id);
        if(this.props.myTeams){
        this.props.myTeams.forEach((value, key) => {
            this.props.socket.off('team-message-cl-' + value.team.id);
            this.props.socket.on('team-message-cl-' + value.team.id);
        });}
    }

    sendMessageHandler = (message, type) => {
        if (message.trim() === '') {
            return;
        }
        let payload = {};
        payload.senderUserId = parseInt(this.props.user.id);
        payload.data = {
            content: message,
            type: type
        };
        if (this.props.openedChat !== null) {
            payload.receiverId = this.props.openedChat.id;
            if (this.props.chatType === 'user') {
                this.props.socket.emit('user-message', payload);
            } else {
                this.props.socket.emit('team-message', payload, () => {
                });
            }
        }
    };

    render() {
        let chatUser = null;
        if (this.props.selectedTeam && this.props.openedChat && this.props.chatType === 'user') {
            let temp = this.props.selectedTeam.teamUsers.find((item) => {
                return item.userId === this.props.openedChat.id
            });
            if (temp) chatUser = temp.user;
        }

        let status;
        if (this.props.openedChat !== null && this.props.chatType === 'user') {
            if (new Date(this.props.openedChat.focu.updatedAt) < new Date(new Date().getTime() - 1000 * 1800)) {
                status = 'default';
            } else {
                switch (chatUser!==null && chatUser.focu.state) {
                    case 'work':
                        status = 'error';
                        break;
                    case 'pause':
                        status = 'warning';
                        break;
                    case 'break':
                        status = 'success';
                        break;
                    case 'offline':
                        status = 'default';
                        break;
                    case 'online':
                        status = 'processing';
                        break;
                    default:
                        status = 'default';
                }
            }
        }

        let header = this.props.openedChat !== null ? this.props.chatType === 'user' ?
            <div className={classes.UserHeader}>
                <span
                    className={classes.UserHeaderName}>{this.props.openedChat.firstName + ' ' + this.props.openedChat.lastName}</span>
                <Badge
                    status={status}
                    text={new Date(this.props.openedChat.focu.updatedAt) < new Date(new Date().getTime() - 1000 * 1800) ? 'offline' : this.props.openedChat.focu.state}/>
            </div> :
            <div className={classes.UserHeader}><span
                className={classes.UserHeaderName}>{this.props.openedChat.name}</span><span>#teamchat</span>
            </div> : null;
        return (
            <div className={classes.Chat}>
                <div className={classes.ChatHeader}>
                    {header}
                </div>
                <div className={classes.ChatField}>
                    <div className={classes.MessageField} ref="myscroll">
                        {this.props.loading ? <Spin size='large' style={{textAlign: 'center', margin: '10px'}}/> : null}
                        <Messages match={this.props.match} history={this.props.history} user={this.props.user}
                                  messages={this.props.messages}
                                  openedChat={this.props.openedChat} chatType={this.props.chatType}/>
                        <div style={{float: "left", clear: "both"}}
                             ref={(el) => {
                                 this.messagesEnd = el;
                             }}>
                        </div>
                    </div>
                    <InputFieldChat match={this.props.match} history={this.props.history}
                                    send={this.sendMessageHandler}/>
                </div>
                <Route path={this.props.match.path + '/images/'}
                       render={(props) => <ImageView {...this.props}/>}/>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        selectedTeam: state.team.selectedTeam,
        openedChat: state.team.openedChat,
        chatType: state.team.chatType,
        loading: state.team.loading,
        token: state.auth.token,
        myTeams: state.team.myTeams,
        socket: state.auth.socket,
        user: state.auth.user,
        messages: state.team.messages
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onChangeMyState: (token, state) => dispatch(actions.changeMyState(token, state)),
        onReceiveMessage: (message) => dispatch(actions.receiveMessage(message)),
        onChangeSeenMess: () => dispatch(actions.changeSeenUser()),
        onCheckUnread: (token, senderid) => dispatch(actions.getUnreadMessage(token, senderid)),
        onSetSeenMessageUser: (socket,userId,senderId) => dispatch(actions.setSeenMessageUser(socket,userId,senderId)),
        onGetTeamUnread: (token, teamid) => dispatch(actions.getUnreadTeamMessage(token, teamid)),
        onSeenTeamMessage: (token, teamid) => dispatch(actions.setSeenTeamMessage(token, teamid)),
        onLoadMoreMessageUser: (token, senderid, lastid, chatType) => dispatch(actions.loadMoreMessageUser(token, senderid, lastid, chatType))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);