import React, {PureComponent} from 'react';
import classes from "./Message.module.scss";
import {Avatar, Icon} from "antd";
import Moment from 'react-moment';
import {DEFAULT_USER_AVATAR, URL} from "../../../../../axios-conf";
import ReactPlayer from "react-player";

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
        let files = this.props.content.split('$$').map(el => {
            return el!==''?<div key={el}>
                <Icon type="cloud-download"/>
                <a rel="noopener noreferrer" style={{color:!this.props.home?'white':'#335fff'}} href={URL + el.split(';')[0]} target='_blank' download>{el.split(';')[1]}</a>
            </div>:null
        });
        return (
            <li className={classes.Message}>
                {this.props.home ? <div title={this.props.user.firstName + ' ' + this.props.user.lastName}
                                        className={classes.MessageAvatar}><Avatar size='large'
                                                                                  src={this.props.user.avatar ? URL + this.props.user.avatar : DEFAULT_USER_AVATAR}/>
                </div> : null}
                <div
                    className={this.props.home ? classes.MessageContent : [classes.MessageContent, classes.MessageAway].join(' ')}>
                    <span
                        className={this.props.home ? [classes.MessageText, (this.props.contentType === 'image' || this.props.contentType === 'youtube') ? classes.Image : null].join(' ') : [classes.MessageText, classes.TextAway, (this.props.contentType === 'image' || this.props.contentType === 'youtube') ? classes.Image : null].join(' ')}>
                        {this.props.contentType === 'text' ? this.props.content : this.props.contentType === 'youtube' ?
                            <div style={{width: '100%'}}>
                                <ReactPlayer url={'https://www.youtube.com/watch?v=' + this.props.content}
                                             width='100%'
                                             config={{
                                                 youtube: {
                                                     playerVars: {
                                                         showinfo: 1, controls: 1, origin: 'http://localhost:3000',
                                                         enablejsapi: 1,
                                                     }
                                                 }
                                             }}
                                /></div>
                            : this.props.contentType !== 'file' ? <div onClick={() => {
                                this.handleOpenImage(this.props.content, this.props.time, this.props.idMessage)
                            }}><img style={{cursor: 'pointer'}} className={classes.ReactPlayer}
                                    alt="no"
                                    width='100%'
                                    src={URL + this.props.content}/>
                            </div> : <div>
                                {
                                    files
                                }
                            </div>}
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
                            src={this.props.user.avatar ? URL + this.props.user.avatar : DEFAULT_USER_AVATAR}/>
                </div> : null}
            </li>
        )
    }
}

export default Message;