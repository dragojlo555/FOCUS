import React,{Component} from 'react';
import classes from './Message.module.scss'
import {Avatar,Icon} from 'antd'
import {DEFAULT_USER_AVATAR} from '../../../../axios-conf';

class Message extends Component{

    render(){
        return(
               <div className={classes.GroupMessage}>
                   <div className={classes.Message}>
                       <div className={classes.MessageAvatar}> <Avatar size='large' src={DEFAULT_USER_AVATAR}/></div>
                       <div className={classes.MessageContent}>
                       <div className={classes.MessageText}>Ovo je tekst poruke i ovaa poruka ima malo vise teksta
                       Jer teba vidjeti kako ce se ponasati</div>
                           <div className={classes.MessageTime}>7 min ago <Icon type='check' style={{color:'blue'}}/><Icon type='check' style={{color:'blue'}}/></div></div>
                   </div>
                   <div className={classes.Message}>
                       <div className={[classes.MessageContent, classes.MessageAway].join(' ')}>
                           <div className={[classes.MessageText,classes.TextAway].join(' ')}>Ovo je tekst poruke</div>
                           <div className={[classes.MessageTime, classes.TimeAway].join(' ')}>7 min ago</div></div>
                       <div className={classes.MessageAvatar}> <Avatar size='large' src={DEFAULT_USER_AVATAR}/></div>
                   </div>
               </div>
        );
    }
}

export default Message;