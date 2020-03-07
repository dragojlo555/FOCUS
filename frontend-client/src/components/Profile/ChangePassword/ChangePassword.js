import React,{Component} from 'react';
import {Modal, Input, Form, message} from 'antd';
import axios from "../../../axios-conf";

class ChangePassword extends Component{

    state={
        visible:true
    };
    handleModalClose = () => {
        this.setState({visible: false})
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
        return (
            <Modal
                title="Change password"
                visible={this.state.visible}
                onOk={this.handleModalContinue}
                onCancel={this.handleModalClose}
            >
                <Form layout='vertical' {...formItemLayout}>
                    <Form.Item label='Old password'>
                        {getFieldDecorator('old', {
                            rules: [{
                                required: true,
                                message: 'Please input your old password!',
                            },
                                {
                                    validator: this.validateToNextPassword,
                                },
                                {
                                    min: 6, message: 'Password to short!'
                                }],
                        })(<Input.Password/>)}
                    </Form.Item>
                    <Form.Item label='New password'>
                        {getFieldDecorator('password', {
                            rules: [{
                                required: true,
                                message: 'Please confirm your password!',
                            },
                                {
                                    validator: this.validateToNextPassword,
                                },],
                        })(<Input.Password onBlur={this.handleConfirmBlur}/>)}
                    </Form.Item>
                    <Form.Item label="Confirm password">
                        {getFieldDecorator('confirm', {
                            rules: [{required: true, message: 'Please confirm your password!',}, {
                                min: 6,
                                message: 'Password to short!'
                            },{
                                validator:this.compareToFirstPassword,
                            }],
                        })(<Input.Password/>)}
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}

const WrappedChangePassword = Form.create({name: 'changePassword'})(ChangePassword);

export default WrappedChangePassword;