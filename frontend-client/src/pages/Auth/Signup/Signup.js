import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {connect} from "react-redux";
import * as actions from '../../../store/actions/index';
import {DEFAULT_USER_AVATAR} from '../../../axios-conf';
import {message} from "antd";
import classes from './Signup.module.scss';
import {Form, Input,Select, Checkbox, Button} from 'antd';
const { Option } = Select;


class Signup extends Component {
    state = {
        file:DEFAULT_USER_AVATAR,
        avatar:null,
        formIsValid: false
    };


    changeImage=(event)=>{
        console.log(event.target.files[0]);
      let img=URL.createObjectURL(event.target.files[0]);
        this.setState(
            {file:img,avatar:event.target.files[0]}
            );
    };


    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.error) {
            message.error(this.props.error.data[0].msg);
        }
    }

    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    };


    validateToNextPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
            return;
        }
        callback();
    };

    /*
    validatePasswordMin = (rule, value, callback) => {
        if (value &&  value.length<6) {
            callback('Enter more characters for the password');
            return;
        }
        callback();
    };*/


    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(this.state.avatar==null){
                message.error('Please choose an avatar!!!');
            }
            if (!err && !(this.state.avatar===null)) {
                this.props.onSignUp(values.email,values.password,values.firstname,values.lastname,this.state.avatar);
            }
        });
    };



    render() {
        let redirect=null;
        console.log(this.props.afterSignUp);
        if(this.props.afterSignUp){
            redirect=<Redirect to='/'/>
        }

        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '387',
        })(
            <Select style={{ width: 80 }}>
                <Option value="387">+387</Option>
                <Option value="381">+381</Option>
            </Select>,
        );

        return (
            <div className={classes.Signup}>
                {redirect}
                <div className={classes.ImgUpload} title='Choose avatar'>
                    <label htmlFor='file-input'>
                        <img src={this.state.file} alt="Choose"/>
                    </label>
                    <input id ="file-input" type="file" onChange={this.changeImage}/>
                </div>
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <Form.Item label="E-mail">
                    {getFieldDecorator('email', {
                        rules: [
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!',
                            },
                            {
                                required: true,
                                message: 'Please input your E-mail!',
                            },
                        ],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="Password" hasFeedback>
                    {getFieldDecorator('password', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                            {
                                validator: this.validateToNextPassword,
                            },
                            {
                            min:6,message:'Password to short!'
                            }
                        ],
                    })(<Input.Password />)}
                </Form.Item>
                <Form.Item label="Confirm Password" hasFeedback>
                    {getFieldDecorator('confirm', {
                        rules: [
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            {
                                validator: this.compareToFirstPassword,
                            },
                        ],
                    })(<Input.Password onBlur={this.handleConfirmBlur} />)}

                </Form.Item>
                <Form.Item label='First name'>
                    {getFieldDecorator('firstname', {
                        rules: [{ required: true, message: 'Please input your first name!', whitespace: true }],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label='Last name'>
                    {getFieldDecorator('lastname', {
                        rules: [{ required: true, message: 'Please input your last name!', whitespace: true }],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="Phone Number">
                    {getFieldDecorator('phone', {
                        rules: [{ required: true, message: 'Please input your phone number!' }],
                    })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} />)}
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    {getFieldDecorator('agreement', {
                        valuePropName: 'checked',
                    })(
                        <Checkbox>
                            I have read the <a href="https://jsguru.io/">agreement</a>
                        </Checkbox>,
                    )}
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                        Register
                    </Button>
                </Form.Item>
            </Form>
            </div>
        )
    }
}

const mapStateToProps=state=>{
return{
    loading:state.auth.loading,
    afterSignUp:state.auth.afterSignUp,
    error:state.auth.error
}
};

const mapDispatchToProps=dispatch=>{
    return {
        onSignUp: (email, password, firstName, lastName, img) => {
            dispatch(actions.signUp(email, password, firstName, lastName, img))
        }
    }
};


const WrappedRegistrationForm = Form.create({ name: 'register' })(Signup);
export default connect(mapStateToProps,mapDispatchToProps)(WrappedRegistrationForm);