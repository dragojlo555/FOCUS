import React, {Component} from 'react';
import classes from './Messages.module.scss'
import Message from './Message/Message';
//import InputFieldChat from "../../../../components/ChatComponent/InputFieldChat/InputFieldChat";
//import ImageView from "../../../../components/ChatComponent/ImageView/ImageView";




class Messages extends Component {

    render() {
        let mess = null;
        if (this.props.messages) {
            mess = this.props.messages.map((value, key) => {
                let home = false;
                let user = null;
                if (this.props.chatType === 'user')
                    if (this.props.user.id === value.senderUserId) {
                        home = true;
                        user = this.props.user
                    } else {
                        home = false;
                        user = this.props.openedChat
                    }
                if (this.props.chatType === 'team') {
                    if (this.props.user.id === value.userid) {
                        home = true;
                        user = this.props.user
                    } else {
                        home = false;
                        user = value.user;
                    }
                }
               const seen=this.props.chatType==='team'?value.seentime:value.seenTime;//after
                return (
                    <Message match={this.props.match} history={this.props.history} key={value.id} idMessage={value.id}
                             chatType={this.props.chatType} seen={seen} content={value.content} user={user}
                       chatUser={this.props.openedChat}   home={home} time={value.createdAt} contentType={value.typecontent}/>
                )
            })
        }
        return (
            <ul className={classes.GroupMessage}>
                {mess}
            </ul>
        );
    }
}

export default Messages;