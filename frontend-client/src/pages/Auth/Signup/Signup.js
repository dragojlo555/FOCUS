import React, {Component} from 'react';
import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/Input';
import {email, length, required, alfa} from "../../../util/validators/validators";
import Auth from "../Auth";
import {Redirect} from 'react-router-dom';
import {connect} from "react-redux";
import * as actions from '../../../store/actions/index';

import classes from './Signup.module.scss';

class Signup extends Component {
    state = {
        file:'http://localhost:5000/public/images/no-profile.jpg',
        avatar:null,
        signupForm: {
            email: {
                type: 'email',
                id:'email',
                control:'input',
                label: 'Your E-mail',
                value: '',
                valid: false,
                touched: false,
                validators: [required, email]
            },
            password: {
                type: 'password',
                id:'password',
                control:'input',
                label: 'Your password',
                value: '',
                valid: false,
                touched: false,
                validators: [required, length({min: 5})]
            },
            firstname: {
                type: 'text',
                id: 'firstname',
                control:'input',
                label: 'First name',
                value: '',
                valid: false,
                touched: false,
                validators: [required,alfa]
            },
            lastname: {
                type: 'text',
                id:'lastname',
                control:'input',
                label:'Last name',
                value: '',
                valid: false,
                touched: false,
                validators: [required,alfa]
            }
        },
        formIsValid: false
    };

    inputBlurHandler = input => {
        console.log(input);
        const updateForm = {
            ...this.state.signupForm,
            [input]: {
                ...this.state.signupForm[input],
                touched: true
            }
        };
        this.setState({signupForm: updateForm})
    };

    inputChangedHandler = (event, input) => {
        let isValid = true;
        for (const validator of this.state.signupForm[input].validators) {
            isValid = isValid && validator(event.target.value);
        }
        const updateForm={
            ...this.state.signupForm,
            [input]:{
                ...this.state.signupForm[input],
                valid:isValid,
                touched:true,
                value:event.target.value
            }
        };
        let formIsValid = true;
        console.log(this.state);
        for (const inputName in updateForm) {
            formIsValid = formIsValid && updateForm[inputName].valid;
        }
        this.setState({signupForm:updateForm,formIsValid:formIsValid});
    };

    changeImage=(event)=>{
        console.log(event.target.files[0]);
      let img=URL.createObjectURL(event.target.files[0]);

        this.setState(
            {file:img,avatar:event.target.files[0]}
            );
    };

    submitHandler=(event)=>{
        event.preventDefault();
        this.props.onSignUp(this.state.signupForm.email.value,this.state.signupForm.password.value,this.state.signupForm.firstname.value
        ,this.state.signupForm.lastname.value,this.state.avatar)
    };

    render() {

        const formElementArray = [];
        for (let key in this.state.signupForm) {
            formElementArray.push({
                config: this.state.signupForm[key],
            });}

        let redirect=null;
        console.log(this.props.afterSignUp);
        if(this.props.afterSignUp){
            redirect=<Redirect to='/'/>
        }

        return (
            <Auth>
                {redirect}
            <form onSubmit={this.submitHandler}>
                <div className={classes.ImgUpload}>
                    <label htmlFor='file-input'>
                        <img src={this.state.file} alt="Choose"/>
                    </label>
                    <input id ="file-input" type="file" onChange={this.changeImage}/>
                </div>
                {
                    formElementArray.map(formElement=>(
                        <Input
                        id={formElement.config.id}
                        key={formElement.config.id}
                        label={formElement.config.label}
                        type={formElement.config.type}
                        control={formElement.config.control}
                        valid={formElement.config.valid}
                        touched={formElement.config.touched}
                        onBlur={()=>this.inputBlurHandler(formElement.config.id)}
                        onChange={(event)=>this.inputChangedHandler(event,formElement.config.id)}
                        />
                        )
                    )
                }
                <Button disabled={!this.state.formIsValid || this.state.avatar==null}
                >SIGN UP</Button>
            </form>
            </Auth>
        )
    }
}

const mapStateToProps=state=>{
return{
    loading:state.auth.loading,
    afterSignUp:state.auth.afterSignUp
}
};

const mapDispatchToProps=dispatch=>{
    return {
        onSignUp: (email, password, firstName, lastName, img) => {
            dispatch(actions.signUp(email, password, firstName, lastName, img))
        }
    }
};


export default connect(mapStateToProps,mapDispatchToProps)(Signup);