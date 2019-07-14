import React, {Component} from 'react';
import classes from "./InputFieldChat.module.scss";
import {Icon} from "antd";


class InputFieldChat extends Component {

    state = {
        textMessage: {
            value: '',
            touched: false,
        }
    };

    inputChangeHandler = (event) => {
        const updateMessage = {
            ...this.state.textMessage,
            value: event.target.value,
            touched: true
        };
        this.setState({textMessage: updateMessage});
    };

    render() {
        return (
            <div className={classes.InputField}>
                        <textarea
                            onKeyPress={(ev) => {
                                if (ev.key === 'Enter' && !ev.shiftKey) {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    this.props.send(this.state.textMessage.value);
                                    this.setState({textMessage: {value: '', touched: 'true'}});
                                }
                            }}
                            onChange={(event) => {
                                this.inputChangeHandler(event)
                            }} placeholder='type here...' value={this.state.textMessage.value}
                            className={classes.InputTextArea}/>
                <div className={classes.SendIcon}>
                    <Icon type="right-circle" theme="twoTone" onClick={() => {
                        this.props.send(this.state.textMessage.value);
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