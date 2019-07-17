import React, {Component} from 'react';
import classes from './Messages.module.scss'
import Message from './Message/Message';

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
                return <Message key={value.id + Date.now()} seen={value.seenTime} content={value.content} user={user}
                                home={home} time={value.createdAt} contentType={value.typecontent}/>
            })
        }
        return (
            <div className={classes.GroupMessage}>
                {mess}
            </div>
        );
    }
}

export default Messages;