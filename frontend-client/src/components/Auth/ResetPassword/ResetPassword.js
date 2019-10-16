import React, {Component} from "react";
import {Modal, Input, Form, Tooltip, Icon, Spin,message} from 'antd';
import classes from './ResetPassword.module.scss'
import axios from "../../../axios-conf";


class ResetPassword extends Component {
    state = {
        loading: false,
        visible: true,
        mail: '',
        step: 1,
        newPassword: '',
        confirmPassword: '',
        secureCodeL: '',
        formIsValid: false,
        confirmDirty: false,
        mailError: false
    };

    compareToFirstPassword = (rule, value, callback) => {
        const {form} = this.props;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    };

    handleConfirmBlur = e => {
        const {value} = e.target;
        this.setState({confirmDirty: this.state.confirmDirty || !!value});
    };


    validateToNextPassword = (rule, value, callback) => {
        const {form} = this.props;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], {force: true});
        }
        callback();
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.visible === true && this.state.visible === false) {
            setTimeout(() => {
                this.props.history.push('/')
            }, 100);
        }
    }

    handleModalContinue = () => {
        if (this.state.step === 1) {
            this.setState({loading: true});
            const url = 'users/changepassword';
            const data = {
                mail: this.state.mail
            };
            let options = {
                method: 'GET',
                url: url,
                params: data,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            };
            axios(options).then(response => {
                if (response.data.exist === true) {
                    this.setState({step: 2})
                } else {
                    this.setState({mailError: true});
                }
                this.setState({loading: false});
            }).catch(error => {
                this.setState({loading: false});
            });
        } else {
            this.handleSubmitForm();
        }
    };

    handleModalClose = () => {
        this.setState({visible: false})
    };

    handleSubmitForm = e => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const url='users/confirmresetpassword';
                const data={
                    mail:this.state.mail,
                    code:values.code,
                    password:values.password,
                    confirm:values.confirm,
                };
                let options={
                    method:'POST',
                    url:url,
                    data:data,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                };
                axios(options).then(response=>{
                        message.info('Password changed !!!');
                        this.setState({visible:false});
                }).catch(err=>{
                       message.error(err.response.data.message);
                })
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {};
        console.log(this.state.mailError);
        return (
            <Modal
                className={classes.ResetPassword}
                title="Reset password"
                visible={this.state.visible}
                onOk={this.handleModalContinue}
                onCancel={this.handleModalClose}
                okText={this.state.step === 1 ? 'Continue' : 'Submit'}
            >
                {this.state.loading ? <Spin tip="Loading..."/> : this.state.step === 1 ?
                    <div>
                        <h3>Please enter your email to reset password for your account.</h3>
                        <Input className={classes.InputMail}
                               suffix={
                                   <Tooltip title="Extra information">
                                       {this.state.mailError?<Icon type="check-circle"
                                              style={{color: 'rgba(255,69,42,0.75)'}}/>
                                              :<></>
                                       }
                                             </Tooltip>
                               } prefix={
                            <Tooltip title="User mail">
                                <Icon type="mail"
                                      style={{color: 'rgba(0,0,0,.45)'}
                                      }/>
                            </Tooltip>
                        }
                               placeholder='Your email' onChange={(e) => {
                            this.setState({mail: e.target.value})
                        }} value={this.state.mail}/>
                        {this.state.mailError ? <span className={classes.MailError}>
                            Your email doesn't exist !!!
                        </span> : <></>}
                    </div> : <div>
                        <h2>Please check your email for a message with your secure code. Your code is 6 digits
                            long.</h2>
                        <Form layout='vertical' {...formItemLayout}>
                            <Form.Item label='New password'>
                                {getFieldDecorator('password', {
                                    rules: [{
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                        {
                                            validator: this.validateToNextPassword,
                                        },
                                        {
                                            min: 6, message: 'Password to short!'
                                        }],
                                })(<Input.Password/>)}
                            </Form.Item>
                            <Form.Item label='Confirm password'>
                                {getFieldDecorator('confirm', {
                                    rules: [{
                                        required: true,
                                        message: 'Please confirm your password!',
                                    },
                                        {
                                            validator: this.compareToFirstPassword,
                                        },],
                                })(<Input.Password onBlur={this.handleConfirmBlur}/>)}
                            </Form.Item>
                            <Form.Item label="Secure code">
                                {getFieldDecorator('code', {
                                    rules: [{required: true, message: 'Please input secure code from email!',}, {
                                        min: 6,
                                        message: 'Code to short!'
                                    }],
                                })(<Input maxLength={6}/>)}
                            </Form.Item>
                        </Form>
                    </div>}
            </Modal>
        )
    }
}

const WrappedResetPassword = Form.create({name: 'resetPassword'})(ResetPassword);

export default WrappedResetPassword;