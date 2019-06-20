import React, {Component} from 'react';
import classes from './Chat.module.scss'
import {connect} from 'react-redux';
import {Badge} from "antd";
import * as actions from "../../../store/actions";
import {Icon} from 'antd';
import Messages from './Messages/Messages';


class Chat extends Component {

    state = {
        textMessage: {
            value: '',
            touched: false,
        }
    };

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    };



    userMessageHandler = data => {
        this.props.onCheckUnread(this.props.token,data.senderUserId);
        if(data.senderUserId===this.props.openedChat.id && data.receivedUserId===parseInt(this.props.userId)) {
            this.props.onReceiveMessage(data);
            this.scrollToBottom();
        }else if(data.senderUserId===parseInt(this.props.userId) && data.receivedUserId===this.props.openedChat.id){
            this.props.onReceiveMessage(data);
            this.scrollToBottom();
        }
    };

    teamMessageHandler =data =>{
      if(this.props.openedChat.id === data.teamid){
          this.props.onReceiveMessage(data);
          this.scrollToBottom();
      }
    };

    componentDidMount() {
        this.props.socket.on('user-message-cl-'+this.props.userId, this.userMessageHandler);
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.openedChat!==prevProps.openedChat){
            if(prevProps.openedChat && prevProps.chatType==='team'){
                this.props.socket.off('team-message-cl-'+prevProps.openedChat.id);
            }
            if(this.props.chatType==='team'){
                console.log(this.props.openedChat.id);
                this.props.socket.on('team-message-cl-'+this.props.openedChat.id, this.teamMessageHandler);
            }
        }
    }

    componentWillUnmount() {
        this.props.socket.off('user-message-cl-'+this.props.userId);
        this.props.socket.off('team-message-cl');
    }

    inputChangeHandler = (event) => {
        const updateMessage = {
            ...this.state.textMessage,
            value: event.target.value,
            touched: true
        };
        this.setState({textMessage: updateMessage});
    };

    sendMessageHandler = () => {
        let payload = {};
        payload.senderUserId = parseInt(this.props.userId);
        payload.data = {
            content: this.state.textMessage.value.trim(),
            type: 'text'
        };
        if (this.props.openedChat !== null) {
            payload.receiverId = this.props.openedChat.id;
            if (this.props.chatType === 'user') {
                this.props.socket.emit('user-message', payload);
                this.setState({textMessage:{value:'',touched:'true'}});
            } else {
                this.props.socket.emit('team-message', payload);
                this.setState({textMessage:{value:'',touched:'true'}});
            }
        }
        console.log('set');
    };

    render() {
        let header = this.props.openedChat !== null ? this.props.chatType === 'user' ?
            <div className={classes.UserHeader}><span
                className={classes.UserHeaderName}>{this.props.openedChat.firstName + ' ' + this.props.openedChat.lastName}</span>
                <Badge
                    status={this.props.openedChat.focu.state === 'work' ? 'error' : this.props.openedChat.focu.state !== 'pause' ? 'success' : 'warning'}
                    text={this.props.openedChat.focu.state}/></div>:
            <div className={classes.UserHeader}><span
                className={classes.UserHeaderName}>{this.props.openedChat.name}</span> <span>#teamchat</span>
            </div> : null;
        return (
            <div className={classes.Chat}>
                <div className={classes.ChatHeader}>
                    {header}
                </div>
                <div className={classes.ChatField}>
                    <div className={classes.MessageField} >
                        <Messages user={this.props.user} messages={this.props.messages} openedChat={this.props.openedChat} chatType={this.props.chatType}/>
                        <div style={{ float:"left", clear: "both" }}
                             ref={(el) => { this.messagesEnd = el; }}>
                        </div>
                    </div>
                    <div className={classes.InputField} >

                        <textarea
                            onKeyPress={(ev) => {
                                if (ev.key === 'Enter') {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    this.sendMessageHandler();
                                }
                            }}
                            onChange={(event) => {
                            this.inputChangeHandler(event)
                        }} placeholder='type here...' value={this.state.textMessage.value}
                                  className={classes.InputTextArea}/>
                        <div className={classes.SendIcon}>
                            <Icon type="right-circle" theme="twoTone" onClick={this.sendMessageHandler}
                                  twoToneColor='#55f409'
                                  className={classes.IconSvg}/>
                        </div>
                    </div>
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
        socket: state.auth.socket,
        userId: state.auth.userId,
        user:state.auth.user,
        messages:state.team.messages
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onChangeMyState: (token, state) => dispatch(actions.changeMyState(token, state)),
        onReceiveMessage:(message)=>dispatch(actions.receiveMessage(message)),
        onCheckUnread:(token,senderid)=>dispatch(actions.getUnreadMessage(token,senderid))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);