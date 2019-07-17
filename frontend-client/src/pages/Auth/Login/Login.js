import React, {Component} from 'react';
import {required, length, email} from '../../../util/validators/validators';
import * as actions from '../../../store/actions/index';
import {connect} from "react-redux";
import {Alert} from 'antd';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import classes from './Login.module.scss';

class Login extends Component {
    state = {
        loginForm: {
            email: {
                value: '',
                valid: false,
                touched: false,
                validators: [required, email]
            },
            password: {
                value: '',
                valid: false,
                touched: false,
                validators: [required, length({min: 6})]
            }
        },
        formIsValid: false
    };


    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.onAuth(values.username,values.password);
            }
        });
    };

    handleSignUpClick=(e)=>{
        e.preventDefault();
        this.props.history.push('/signup');
    };

    render() {
          let errorMail=null;
        let errorPass=null;
        if(this.props.afterSignUp){
            this.props.onAfterSignUp();
        }
        if(this.props.error){
            if(this.props.error.data.inputField==='email'){
                errorMail= <Alert
                    message={this.props.error.data.msg}
                    type="error"
                    showIcon
                    closable
                    style={{width:'300px'}}
                />
            }
         if(this.props.error.data.inputField==='password'){
                errorPass= <Alert
                    message={this.props.error.data.msg}
                    type="error"
                    showIcon
                    closable
                    style={{width:'300px'}}
                />
            }
        }
        const { getFieldDecorator } = this.props.form;
        return (
            <div className={classes.Login}>
                {errorMail}
                {errorPass}
                <Form style={{width:'300px',margin:'auto'}} onSubmit={this.handleSubmit} className="login-form">
                    <Form.Item>
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: 'Please input your email!' },],
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Email"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input your Password!' },
                                {min:6,message:'Password to short!'}
                            ],
                        })(
                            <Input.Password placeholder='Password'  prefix={<Icon type="lock"/>}/>
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(<Checkbox>Remember me</Checkbox>)}
                        <a className="login-form-forgot" href="/signup">
                            Forgot password
                        </a>
                        < Button style={{width:'100%'}} type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                        Or <a href='/signup' onClick={this.handleSignUpClick}>register now!</a>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}
const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(Login);
const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        afterSignUp:state.auth.afterSignUp
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth:(email,password)=>dispatch(actions.auth(email,password)),
        onAfterSignUp:()=>dispatch(actions.afterSignUp()),
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(WrappedNormalLoginForm);