import React, {Component} from 'react';
import classes from "./InputFieldChat.module.scss";
import {Icon, Avatar, message} from "antd";
import imageIcon from '../../../assets/image-icon.png';
import fileIcon from '../../../assets/upload.svg';
import {Route} from 'react-router-dom';
import UploadFiles from '../UploadFiles/UploadFiles';


class InputFieldChat extends Component {
    state = {
        input: true,
        file: null,
        image: null,
        avatar: null,
        textMessage: {
            value: '',
            touched: false,
        }
    };

    addImage = (event) => {
        const file = event.target.files[0];
        console.log(file.type);
        if (file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/svg' || file.type === 'image/bmp') {
            let img = URL.createObjectURL(event.target.files[0]);
            let reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (e) => {
                this.setState({image: e.target.result});
            };
            this.setState(
                {file: img, avatar: event.target.files[0]}
            );
        } else {
            message.error(`${file.name} image upload failed.`);
        }
    };

    checkYTUrl = () => {
        let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        let match = this.state.textMessage.value.match(regExp);
        return (match && match[7].length === 11) ? match[7] : null;
    };


    sendFunction = () => {
        let type = this.state.image ? 'image' : 'text';
        let value = this.state.image ? this.state.image : this.state.textMessage.value;
        try {
            const url = this.checkYTUrl();
            if (url) {
                type = 'youtube';
                value = url;
            }
        } catch (e) {

        }
        this.props.send(value, type);
        this.setState({textMessage: {value: '', touched: 'true'}, image: null, file: null, input: null});
    };


    inputChangeHandler = (event) => {
        const updateMessage = {
            ...this.state.textMessage,
            value: event.target.value,
            touched: true
        };
        this.setState({textMessage: updateMessage});
    };


    handleExitChatImage = () => {
        this.setState({image: null, file: null});
    };

    handleUpload = () => {
        this.props.history.push('/home/uploadfiles/');
    };

    render() {
        let area = this.state.file ?
            <div className={classes.SendImageWithExit}>
                <span onClick={this.handleExitChatImage}>x</span>
                <img height='48px' alt='nema' src={this.state.file}/>
            </div>
            : <textarea
                onKeyPress={(ev) => {
                    if (ev.key === 'Enter' && !ev.shiftKey) {
                        ev.preventDefault();
                        ev.stopPropagation();
                        this.sendFunction();
                        this.setState({textMessage: {value: '', touched: 'true'}});
                    }
                }}
                onChange={(event) => {
                    this.inputChangeHandler(event)
                }} placeholder='type here...' value={this.state.textMessage.value}
                className={classes.InputTextArea}/>;
        return (
            <div className={classes.InputField}>
                <div title='choose image' className={classes.SendImage}>
                    <label htmlFor='image_send'>
                        <Avatar className={classes.SendImageIcon} src={imageIcon}/>
                    </label>
                    <input id="image_send" accept="image/jpg, image/png ,image/svg,image/bmp" type="file"
                           onChange={this.addImage}/>
                </div>
                <div title='select files' className={classes.FileUpload} onClick={this.handleUpload}>
                    <Avatar src={fileIcon}/>
                </div>
                {area}
                <div className={classes.SendIcon}>
                    <Icon type="right-circle" theme="twoTone" onClick={() => {
                        this.sendFunction();
                        this.setState({textMessage: {value: '', touched: 'true'}});
                    }}
                          twoToneColor='#55f409'
                          className={classes.IconSvg}/>
                </div>
                <Route path={this.props.match.path + '/uploadfiles/'}
                       render={(props) => <UploadFiles{...props} send={this.props.send}/>}/>
            </div>
        )
    }
}

export default InputFieldChat;