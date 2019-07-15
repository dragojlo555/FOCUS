import React,{Component} from 'react';
import {connect} from "react-redux";
import {Form, Input, Select, Modal} from 'antd';
import {DEFAULT_USER_AVATAR,URLT} from "../../../axios-conf";
import classes from "./EditProfile.module.scss";
import  * as actions from '../../../store/actions/index';
const { Option } = Select;

class EditProfile extends Component{

    state={
        file:DEFAULT_USER_AVATAR,
        avatar:null,
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.count !== prevProps.count){
            this.props.form.setFieldsValue({
                'firstname': this.props.user.firstName,
                'lastname':this.props.user.lastName,
                'phone':this.props.user.phone.split(';')[1],
                'prefix':this.props.user.phone.split(';')[0],
            });
            this.setState({file:URLT+this.props.user.avatar});
        }
    }

    changeImage=(event)=>{

        let img=URL.createObjectURL(event.target.files[0]);
        this.setState(
            {file:img,avatar:event.target.files[0]}
        );
    };

    handleModalOk=()=>{
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if(this.state.avatar){
                    this.props.onEditProfileAvatar(this.props.token,values.firstname,values.lastname,values.prefix+';'+values.phone,this.state.avatar);
                }else{
                    this.props.onEditProfile(this.props.token,values.firstname,values.lastname,values.prefix+';'+values.phone);
                }
                this.props.handleOk();
            }
        });

    };

    handleModalCancel=()=>{
        this.props.handleCancel();
    };


    render(){

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

    const prefixSelector = getFieldDecorator('prefix', {
        initialValue: '387',
    })(
        <Select style={{ width: 80 }}>
            <Option value="387">+387</Option>
            <Option value="381">+381</Option>
        </Select>,
    );

    return(
        <Modal
            title="Edit Profile"
            visible={this.props.visible}
            onOk={this.handleModalOk}
            onCancel={this.handleModalCancel}
            okText='Save'
        >
        <div>
            <div className={classes.ImgUpload} title='Choose avatar'>
                <label htmlFor='file-input'>
                    <img src={this.state.file} alt="Choose"/>
                </label>
                <input id ="file-input" type="file" onChange={this.changeImage}/>
            </div>
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <Form.Item label='First name'>
                    {getFieldDecorator('firstname',{
                        rules: [{ required: true, message: 'Please input your first name!', whitespace: true }],
                    })(<Input/>)}
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
            </Form>
        </div>
        </Modal>
    )
}
}

const mapStateToProps=(state)=>{
    return{
        user:state.auth.user,
        token:state.auth.token
    }
};

const mapDispatchToProps=(dispatch)=>{
    return{
    onEditProfileAvatar:(token,firstname,lastname,phone,avatar)=>dispatch(actions.editProfileAvatar(token,firstname,lastname,phone,avatar)),
        onEditProfile:(token,firstname,lastname,phone)=>dispatch(actions.editProfile(token,firstname,lastname,phone))
    }
};

const WrappedEditProfileForm = Form.create({ name: 'editProfile' })(EditProfile);
export default connect(mapStateToProps,mapDispatchToProps)(WrappedEditProfileForm);
