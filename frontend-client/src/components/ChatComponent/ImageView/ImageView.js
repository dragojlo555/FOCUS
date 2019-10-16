import React, {Component} from 'react';
import {Icon, Modal} from 'antd';
import axios, { URL} from "../../../axios-conf";
import classes from "./ImageView.module.scss";


class ImageView extends Component {


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.visible === true && this.state.visible === false) {
            setTimeout(() => {
                this.props.history.push('/home')
            }, 100);
        }
    }

    componentDidMount() {
        const navProps = this.props.history.location.state;
        this.setState({
            chatType: navProps.chatType,
            chatUser: navProps.chatUser,
            time: navProps.time,
            messageKey:navProps.idMessage,
            content:navProps.imagePath
        })
    }

    state = {
        visible: true,
        chatUser: null,
        type: null,
        time: null,
        messageKey:null,
        content:null
    };

    handleGetImage=(type)=>{
        const data = {
            id:+this.state.chatUser.id,
            chatType:this.state.chatType,
            type:type,
            messageKey: this.state.messageKey,
        };
        const url = 'chat/image';
        let options = {
            params: data,
            method: 'GET',
            url: url,
            headers: {
                'Authorization': `bearer ${this.props.token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        };
        axios(options).then(response => {
           if(response.data.message!==null){
               this.setState({
                   messageKey:response.data.message.id,
                   content:response.data.message.content
               });
           }
        }).catch(err => {
            console.log('Unread error', err.response);
        });
    };

    handleModalClose = () => {
        this.setState({visible: false});
    };

    handleModalOk = () => {
        this.setState({visible: false});
    };

    render() {
        return (
            <Modal title="Image"
                   style={{width: '80%'}}
                   width='95%'
                   visible={this.state.visible}
                   onOk={this.handleModalOk}
                   onCancel={this.handleModalClose}
                   zIndex={100}
                   footer={[]}
            >
                <div style={{
                    width: '100%',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: "space-between"
                }}>
                    <div className={classes.ImageControl}>
                        <Icon onClick={()=>{this.handleGetImage('previous')}} className={classes.PreviousIcon} title='previous' type='left'/>
                        <Icon onClick={()=>{this.handleGetImage('next')}} className={classes.NextIcon} type='right' title='next'/>
                    </div>
                    <div>
                        <img
                            className={classes.Drago}
                            style={{maxWidth: '100%', maxHeight: '80%', userSelect: 'none'}}
                            alt="no"
                            src={URL + this.state.content}/>
                    </div>

                </div>
            </Modal>
        )
    }
};


export default ImageView;