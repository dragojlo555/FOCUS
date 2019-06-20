import React, {Component} from 'react';
import classes from "./Message.module.scss";
import {Avatar, Icon} from "antd";
import Moment from 'react-moment';
import {DEFAULT_USER_AVATAR, URL} from "../../../../../axios-conf";

class Message extends Component {

    render() {
        return (
            <div className={classes.Message}>
                {this.props.home ? <div title={this.props.user.firstName+' '+this.props.user.lastName} className={classes.MessageAvatar}><Avatar  size='large' src={this.props.user.Avatar ? URL + this.props.user.Avatar : DEFAULT_USER_AVATAR}/>
                </div> : null}
                <div
                    className={this.props.home ? classes.MessageContent : [classes.MessageContent, classes.MessageAway].join(' ')}>
                    <div
                        className={this.props.home ? classes.MessageText : [classes.MessageText, classes.TextAway].join(' ')}>{this.props.content}</div>
                    <div
                        className={this.props.home ? classes.MessageTime : [classes.MessageTime, classes.TimeAway].join(' ')}>
                        <Moment style={{fontSize:'80%'}} fromNow>{this.props.time}</Moment>
                        {!this.props.home ? null: <><Icon type='check' style={{color: 'blue'}}/><Icon type='check' style={{color: 'blue'}}/></>}</div>
                </div>
                {!this.props.home ? <div className={classes.MessageAvatar} title={this.props.user.firstName+' '+this.props.user.lastName}>
                    <Avatar size='large' src={this.props.user.Avatar ? URL + this.props.user.Avatar : DEFAULT_USER_AVATAR}/>
                </div> : null}
            </div>
        )
    }

}

export default Message;