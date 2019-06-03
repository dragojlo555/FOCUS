import React, {Component} from 'react';
import classes from './Chat.module.scss'
import {connect} from 'react-redux';
//import {URL,DEFAULT_USER_AVATAR} from '../../../axios-conf';
//import * as action from '../../../store/actions/index';
import { Badge} from "antd";
import * as actions from "../../../store/actions";
import {Icon} from 'antd';
import Message from './Message/Message';

class Chat extends Component {
    state = {

        textMessage: {
            value: '',
            touched: false,
        }
    };

    teamMessageHandler = data => {
        console.log(data,'team');
    };

    userMessageHandler=data=>{
        console.log(data,'user');
    };

    componentDidMount() {
        //   this.setState({});
        //   socket.emit('data');
        this.props.socket.on('user-message-cl', this.userMessageHandler);
        this.props.socket.on('team-message-cl', this.teamMessageHandler);

    }

    componentWillUnmount() {
        //this.state.socket.disconnect();
        //console.log('unmount');
        this.props.socket.off('team');
        this.props.socket.off('drago');
    }

    ispsi = () => {
        console.log('Drago');
        this.props.socket.emit('drago', 'world');
    };

    inputChangeHandler = (event) => {
        const updateMessage = {
            ...this.state.textMessage,
            value: event.target.value,
            touched: true
        };
        this.setState({textMessage: updateMessage});
    };

    sendMessageHandler=()=>{
        let payload={};
        payload.senderUserId=parseInt(this.props.userId);
        payload.data={
          content:this.state.textMessage.value,
          type:'text'
        };
        if(this.props.openedChat !== null){
            payload.receiverId=this.props.openedChat.id;
           if(this.props.chatType === 'user'){
               this.props.socket.emit('user-message', payload);
           }else{
               this.props.socket.emit('team-message', payload);
           }
       }

    };

    render() {
        let header = this.props.openedChat !== null ? this.props.chatType === 'user' ?
            <div className={classes.UserHeader}><span
                className={classes.UserHeaderName}>{this.props.openedChat.firstName + ' ' + this.props.openedChat.lastName}</span>
                <Badge
                    status={this.props.openedChat.focu.state === 'work' ? 'error' : this.props.openedChat.focu.state !== 'pause' ? 'success' : 'warning'}
                    text={this.props.openedChat.focu.state}/></div> :
            <div className={classes.UserHeader}><span
                className={classes.UserHeaderName}>{this.props.openedChat.name}</span> <span>#teamchat</span>
            </div> : null;
        return (
            <div className={classes.Chat}>
                <div className={classes.ChatHeader}>
                    {header}
                </div>
                <div className={classes.ChatField}>
                    <div className={classes.MessageField}>
                        <Message/>
                    </div>
                    <div className={classes.InputField}>
                        <textarea onChange={(event) => {
                            this.inputChangeHandler(event)
                        }} placeholder='type here...' value={this.state.textMessage.value}
                                  className={classes.InputTextArea}/>
                        <div className={classes.SendIcon}>
                            <Icon type="right-circle" theme="twoTone" onClick={this.sendMessageHandler} twoToneColor='#55f409'
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
        openedChat: state.chat.openedChat,
        chatType: state.chat.chatType,
        token: state.auth.token,
        socket: state.auth.socket,
        userId:state.auth.userId
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onChangeMyState: (token, state) => dispatch(actions.changeMyState(token, state)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);