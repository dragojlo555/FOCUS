import React, {Component} from 'react';
import classes from "./Message.module.scss";
import {Avatar, Icon} from "antd";
import Moment from 'react-moment';
import {DEFAULT_USER_AVATAR, URL} from "../../../../../axios-conf";

class Message extends Component {

    render() {
        return (
            <div className={classes.Message}>
                {this.props.home ? <div title={this.props.user.firstName+' '+this.props.user.lastName} className={classes.MessageAvatar}><Avatar  size='large' src={this.props.user.avatar ? URL + this.props.user.avatar : DEFAULT_USER_AVATAR}/>
                </div> : null}
                <div
                    className={this.props.home ? classes.MessageContent : [classes.MessageContent, classes.MessageAway].join(' ')}>
                    <span
                        className={this.props.home ? classes.MessageText : [classes.MessageText, classes.TextAway].join(' ')}>{this.props.content}</span>
                    <div
                        className={this.props.home ? classes.MessageTime : [classes.MessageTime, classes.TimeAway].join(' ')}>
                        <Moment style={{fontSize:'80%'}} fromNow>{this.props.time}</Moment>
                        {this.props.home?this.props.seen?<><Icon type='check' style={{color: 'blue'}}/><Icon type='check' style={{color: 'blue'}}/></>:
                            <><Icon type='check' style={{color: 'gray'}}/><Icon type='check' style={{color: 'gray'}}/></>:null}
                    </div>
                </div>
                {!this.props.home ? <div className={classes.MessageAvatar} title={this.props.user.firstName+' '+this.props.user.lastName}>
                    <Avatar  size='large' src={this.props.user.avatar ? URL + this.props.user.avatar : DEFAULT_USER_AVATAR}/>
                </div> : null}
            </div>
        )
    }

}

export default Message;