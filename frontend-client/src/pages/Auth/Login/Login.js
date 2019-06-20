import React, {Component} from 'react';
import {required, length, email} from '../../../util/validators/validators';
import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/Input';
import Auth from '../Auth';
import * as actions from '../../../store/actions/index';
import {connect} from "react-redux";
import {Alert} from 'antd';


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

    inputBlurHandler = input => {
        const updateForm = {
            ...this.state.loginForm,
            [input]: {
                ...this.state.loginForm[input],
                touched: true
            }
        };
        this.setState({loginForm: updateForm})
    };

    inputChangedHandler = (event, input) => {
        let isValid = true;
        for (const validator of this.state.loginForm[input].validators) {
            isValid = isValid && validator(event.target.value);
        }
        const updateForm = {
            ...this.state.loginForm,
            [input]: {
                ...this.state.loginForm[input],
                valid: isValid,
                touched: true,
                value: event.target.value
            }
        };
        let formIsValid = true;
        for (const inputName in updateForm) {
            formIsValid = formIsValid && updateForm[inputName].valid;
        }
        this.setState({loginForm: updateForm,formIsValid:formIsValid});
    };

    submitHandler=(event)=>{
      event.preventDefault();
      this.props.onAuth(this.state.loginForm.email.value,this.state.loginForm.password.value);
    };

    render() {

      //  let afterSignUp=null;
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
                />
            }
         if(this.props.error.data.inputField==='password'){
                errorPass= <Alert
                    message={this.props.error.data.msg}
                    type="error"
                    showIcon
                    closable
                />
            }
        }
        return (
            <Auth>{errorMail}{errorPass}
                <form onSubmit={this.submitHandler}>
                <Input
                    id='email'
                    label='Your E-mail'
                    type='email'
                    key='email'
                    control='input'
                    onChange={(event) => this.inputChangedHandler(event, 'email')}
                    onBlur={() => this.inputBlurHandler('email')}
                    value={this.state.loginForm['email'].value}
                    valid={this.state.loginForm['email'].valid && !errorMail}
                    touched={this.state.loginForm['email'].touched}
                />
                <Input
                    id='password'
                    label='Your password'
                    type='password'
                    key='password'
                    control='input'
                    onChange={(event) => this.inputChangedHandler(event, 'password')}
                    onBlur={() => this.inputBlurHandler(('password'))}
                    value={this.state.loginForm['password'].value}
                    valid={this.state.loginForm['password'].valid && !errorPass}
                    touched={this.state.loginForm['password'].touched}/>

                <Button
                    disabled={!this.state.formIsValid}
                >SIGN IN</Button>
                    </form>
            </Auth>
        )
    }
}

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

export default connect(mapStateToProps,mapDispatchToProps)(Login);