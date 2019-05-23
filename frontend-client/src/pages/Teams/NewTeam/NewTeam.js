import React, {Component, Fragment} from 'react';
import Input from '../../../components/UI/Input/Input';
import Button from '../../../components/UI/Button/Button';
import {length, required} from "../../../util/validators/validators";
import classes from './NewTeam.module.scss';
import {connect} from 'react-redux';
import * as actions from '../../../store/actions/index';
import Spinner from '../../../components/UI/Spinner/Spinner';
import {Alert} from 'antd';


class NewTeam extends Component {
    state = {
        file: 'http://localhost:5000/public/images/no-profile.jpg',
        avatar: null,
        newTeamForm: {
            name: {
                type: 'text',
                id: 'name',
                control: 'input',
                label: 'Name',
                value: '',
                valid: false,
                touched: false,
                validators: [required, length({min: 3})]
            }
        },
        formIsValid: false
    };

    componentWillUnmount() {
        this.props.onCreateEnd();
    }

    inputChangedHandler = (event, input) => {
        let isValid = true;
        for (const validator of this.state.newTeamForm[input].validators) {
            isValid = isValid && validator(event.target.value);
        }
        const updateForm = {
            ...this.state.newTeamForm,
            [input]: {
                ...this.state.newTeamForm[input],
                valid: isValid,
                touched: true,
                value: event.target.value
            }
        };
        let formIsValid = true;
        for (const inputName in updateForm) {
            formIsValid = formIsValid && updateForm[inputName].valid;
        }
        this.setState({newTeamForm: updateForm, formIsValid: formIsValid});
    };

    inputBlurHandler = input => {
        const updateForm = {
            ...this.state.newTeamForm,
            [input]: {
                ...this.state.newTeamForm[input],
                touched: true
            }
        };
        this.setState({newTeamForm: updateForm})
    };

    submitHandler = (event) => {
        event.preventDefault();
        this.props.onCreateTeam(this.state.newTeamForm.name.value, this.state.avatar, this.props.token);
    };

    changeImage = (event) => {
        console.log(event.target.files[0]);
        const file = event.target.files[0];
        if (file != null && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/svg')) {
            let img = URL.createObjectURL(event.target.files[0]);
            this.setState(
                {file: img, avatar: event.target.files[0]}
            );
        }
    };

    closeDialogAfterCreateHandler=()=>{
      this.props.cancel();
      this.setState({avatar:null,file:'http://localhost:5000/public/images/no-profile.jpg'});
      setTimeout(this.props.onCreateEnd,1000);
    };

    render() {
        const formElementArray = [];
        for (let key in this.state.newTeamForm) {
            formElementArray.push({
                config: this.state.newTeamForm[key],
            });
        }

        let dialog = <Fragment>
            <div className={classes.HeaderNewTeam}>New Team</div>
            <form onSubmit={this.submitHandler}>
                <div className={classes.ImgUploadNewTeam}>
                    <label htmlFor='file-input'>
                        <img title='Choose image' src={this.state.file} alt="Choose"/>
                    </label>
                    <input id="file-input" type="file" onChange={this.changeImage}/>
                </div>
                {
                    formElementArray.map(formElement => (
                            <Input
                                id={formElement.config.id}
                                key={formElement.config.id}
                                label={formElement.config.label}
                                type={formElement.config.type}
                                control={formElement.config.control}
                                valid={formElement.config.valid}
                                touched={formElement.config.touched}
                                onBlur={() => this.inputBlurHandler(formElement.config.id)}
                                onChange={(event) => this.inputChangedHandler(event, formElement.config.id)}
                            />
                        )
                    )
                }
                <div className={classes.ButtonsNewTeam}>
                    <Button type='submit'
                            disabled={!this.state.formIsValid || this.state.avatar == null}>CONFIRM</Button>
                    <Button type='button' onClick={this.props.cancel}>CANCEL</Button>
                </div>
            </form>
        </Fragment>;
        if (this.props.loading) {
            dialog = <Spinner/>;
        }
        console.log(this.props.createTeamData);
        if ( this.props.createTeamData !=null) {
            console.log(this.props.createTeamData.msg);
            if(this.props.createTeamData.msg==='Success'){
                dialog=<div>
                    <Alert
                        message="Success Tips"
                        description={this.props.createTeamData.data.name}
                        type="success"
                        showIcon
                        closable
                        onClose={this.closeDialogAfterCreateHandler}
                    />
                </div>
            }else{
                dialog=<div>Failed
                    <Button type='button' onClick={this.props.cancel}>CANCEL</Button>
                </div>
            }
        }
        return (
            <Fragment>
                {dialog}
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.auth.loading,
        token: state.auth.token,
        error: state.team.error,
        myTeams: state.team.myTeams,
        createTeamData: state.team.createTeamData
    }
};

const mapDispatchToPros = dispatch => {
    return {
        onCreateTeam: (name, image, token) => dispatch(actions.createTeam(name, image, token)),
        onCreateEnd: () => dispatch(actions.createTeamEnd())
    }
};


export default connect(mapStateToProps, mapDispatchToPros)(NewTeam);