import React, {Component} from 'react';
import classes from './NewTeam.module.scss';
import {connect} from 'react-redux';
import {DEFAULT_TEAM_AVATAR}from '../../../axios-conf';
import * as actions from '../../../store/actions/index';
import Spinner from '../../../components/UI/Spinner/Spinner';
import {Form, Input, Modal, Alert, Button, message} from 'antd';


class NewTeam extends Component {
    state = {
        file: DEFAULT_TEAM_AVATAR,
        avatar: null,
        formIsValid: false
    };

    componentWillUnmount() {
        this.props.onCreateEnd();
    }



    handleModalOk=()=>{
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if(this.state.avatar){
                    this.props.onCreateTeam(values.teamname, this.state.avatar, this.props.token);
                }else{
                    message.error('Please choose an avatar!!!');
                }
                this.props.handleClose();
            }
        });
    };

    changeImage = (event) => {
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

        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        let dialog= <Modal
            title="New Team"
            visible={this.props.visible}
            onOk={this.handleModalOk}
            onCancel={this.props.handleClose}
            okText='Confirm'
        >
            <div>
                <div className={classes.ImgUploadNewTeam} title='Choose avatar'>
                    <label htmlFor='file-input'>
                        <img src={this.state.file} alt="Choose"/>
                    </label>
                    <input id ="file-input" type="file" onChange={this.changeImage}/>
                </div>
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Form.Item label='Team name'>
                        {getFieldDecorator('teamname',{
                            rules: [{ required: true, message: 'Please input team name!', whitespace: true },
                                {
                                    min:3,message:'Name to short!'
                                }
                            ],
                        })(<Input/>)}
                    </Form.Item>
                </Form>
            </div>
        </Modal>;

        if (this.props.loading) {
            dialog = <Spinner/>;
        }

        if ( this.props.createTeamData !=null) {
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
                    <Button  onClick={this.props.cancel}>Cancel</Button>
                </div>
            }
        }

        return (
            <>
            {dialog}
            </>
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

const WrappedNewTeam = Form.create({ name: 'newTeam' })(NewTeam);
export default connect(mapStateToProps, mapDispatchToPros)(WrappedNewTeam);