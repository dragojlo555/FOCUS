import React, {Component} from 'react';
import {required, length, email} from '../../../util/validators/validators';
import * as actions from '../../../store/actions/index';
import {connect} from "react-redux";
import { Form, Icon, Input, Button, Checkbox,Modal,Alert} from 'antd';
import classes from './Login.module.scss';
import socketIOClient from 'socket.io-client';




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
        formIsValid: false,
        socket:null
    };



    handleForgotPassword=()=>{
        this.props.history.push({
            pathname: '/forgot/'
        });
    };

    handleGoogleSignIn=()=>{
        this.props.onSignInWithGoogle();

    };

    handleResendMailVerification=()=>{
        this.props.onResendVerificationMail(this.props.mail);

    };
    componentDidMount() {
       const socket=socketIOClient('https://us-api.stg.mobileguardian.com/screenshare');
       socket.emit('classSubscribe',{message:{id:5644654631}});

       console.log(socket);
            socket.on('classSubscribe',(res)=>{
                console.log(res);
            });
            socket.on('screenShareReceive',res=>{
            console.log(res);
            });


    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.onAuth(values.username,values.password);
            }
        });
    };

    handleModalCancel=()=>{
        this.props.onAfterSignUp();
    };

    handleSignUpClick=(e)=>{
        e.preventDefault();
        this.props.history.push('/signup');
    };

    render() {
          let errorMail=null;
          let errorPass=null;
       /* if(this.props.afterSignUp){
         //   this.props.onAfterSignUp();
        }*/
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
            if(this.props.error.data.inputField==='verify'){
                errorPass= <Alert
                    message={<div><span>{this.props.error.data.msg}<Button type='link' onClick={this.handleResendMailVerification}> Resend mail!</Button></span></div>}
                    type="error"
                    showIcon
                    closable
                    style={{width:'350px'}}
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
                        <Button type='link' className="login-form-forgot" onClick={this.handleForgotPassword}>
                            Forgot password?
                        </Button>
                        < Button style={{width:'100%'}} type="primary" htmlType="submit" className="login-form-button">
                            Sign in
                        </Button>
                        <a href='http://localhost:5000/api/users/auth/google'>
                        < Button onClick={this.handleGoogleSignIn} type="primary" className={classes.GoogleButton}>
                            <Icon className={classes.GoogleIcon} type="google-plus" />
                            Sign in with Google
                        </Button>
                       </a>
                        Or <a href='/signup' onClick={this.handleSignUpClick}>register now!</a>
                    </Form.Item>
                </Form>
                <Modal
                    title="Verify email"
                    visible={this.props.afterSignUp}
                    onOk={this.handleModalCancel}
                    onCancel={this.handleModalCancel}
                    okText='Save'
                    footer={<Button onClick={this.handleModalCancel} type='primary'>Ok</Button>}
                >
                    <div>
                        Please, verify your Email address!!!
                    </div>
                </Modal>
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
        afterSignUp:state.auth.afterSignUp,
        mail:state.auth.mail
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth:(email,password)=>dispatch(actions.auth(email,password)),
        onAfterSignUp:()=>dispatch(actions.afterSignUp()),
        onResendVerificationMail:(mail)=>dispatch(actions.resendVerificationMail(mail)),
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(WrappedNormalLoginForm);