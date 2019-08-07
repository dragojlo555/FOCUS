import React, {Component} from 'react';
import classes from "./InputFieldChat.module.scss";
import {Icon, Avatar} from "antd";
import imageIcon from '../../../assets/image-icon.png';


class InputFieldChat extends Component {
    state = {
        input: true,
        file: null,
        image:null,
        avatar: null,
        textMessage: {
            value: '',
            touched: false,
        }
    };

    changeImage = (event) => {
        let img = URL.createObjectURL(event.target.files[0]);
        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload=(e)=>{
            this.setState({image:e.target.result});
        };
        this.setState(
            {file: img, avatar: event.target.files[0]}
        );
    };

    sendFunction=()=>{
        let type=this.state.image?'image':'text';
        let value=this.state.image?this.state.image:this.state.textMessage.value;
        this.props.send(value,type);
        this.setState({textMessage: {value: '', touched: 'true'},image:null,file:null,input:null});
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
        this.setState({image:null,file:null});
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
                <div className={classes.SendImage}>
                    <label htmlFor='file-input'>
                        <Avatar className={classes.SendImageIcon} src={imageIcon}/>
                    </label>
                    <input id="file-input" type="file" onChange={this.changeImage}/>
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
            </div>
        )
    }
}

export default InputFieldChat;