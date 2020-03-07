import React, {PureComponent} from 'react';
import classes from "./Message.module.scss";
import {Avatar, Icon} from "antd";
import Moment from 'react-moment';
import {URL, getAvatar} from "../../../../../axios-conf";
import YouTubePlayer from '../../../../../components/ChatComponent/YoutubePlayer/TouTubePlayer';
import PreviewFile from "../../../../../components/ChatComponent/PreviewFile/PreviewFile";

class Message extends PureComponent {

    handleOpenImage = (content, time, id) => {
        this.props.history.push({
            pathname: '/home/images/',
            state: {
                imagePath: content,
                time: time,
                chatType: this.props.chatType,
                chatUser: this.props.chatUser,
                idMessage: id
            }
        });
    };

    render() {
        return (
            <li className={classes.Message}>
                {this.props.home ? <div title={this.props.user.firstName + ' ' + this.props.user.lastName}
                                        className={classes.MessageAvatar}><Avatar size='large'
                                                                                  src={getAvatar(this.props.user.avatar)}/>
                </div> : null}
                <div
                    className={this.props.home ? classes.MessageContent : [classes.MessageContent, classes.MessageAway].join(' ')}>
                    <span
                        className={this.props.home ? [classes.MessageText, (this.props.contentType === 'image' || this.props.contentType === 'youtube') ? classes.Image : null].join(' ') : [classes.MessageText, classes.TextAway, (this.props.contentType === 'image' || this.props.contentType === 'youtube') ? classes.Image : null].join(' ')}>
                        {this.props.contentType === 'text' ? this.props.content : this.props.contentType === 'youtube' ?
                            <YouTubePlayer content={this.props.content}/>
                            : this.props.contentType !== 'file' ? <div onClick={() => {
                                this.handleOpenImage(this.props.content, this.props.time, this.props.idMessage)
                            }}><img style={{cursor: 'pointer'}} className={classes.ReactPlayer}
                                    alt="no"
                                    width='100%'
                                    src={URL + this.props.content}/>
                            </div> : <PreviewFile content={this.props.content} home={this.props.home}/>}
                    </span>
                    <div
                        className={this.props.home ? classes.MessageTime : [classes.MessageTime, classes.TimeAway].join(' ')}>
                        <Moment style={{fontSize: '80%'}} fromNow>{this.props.time}</Moment>
                        {this.props.home ? this.props.seen ? <><Icon type='check' style={{color: 'blue'}}/><Icon
                                type='check' style={{color: 'blue'}}/></> :
                            <><Icon type='check' style={{color: 'gray'}}/></> : null}
                    </div>
                </div>
                {!this.props.home ? <div className={classes.MessageAvatar}
                                         title={this.props.user.firstName + ' ' + this.props.user.lastName}>
                    <Avatar size='large'
                            src={getAvatar(this.props.user.avatar)}/>
                </div> : null}
            </li>
        )
    }
}

export default Message;