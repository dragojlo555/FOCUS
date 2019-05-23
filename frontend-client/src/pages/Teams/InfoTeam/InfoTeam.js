import React, {Component} from 'react';
import classes from './InfoTeam.module.scss';
import {List, Avatar, Button, Input, Icon, Form,message} from 'antd';
import {email, required} from "../../../util/validators/validators";
import {connect} from "react-redux";
import axios from "../../../axios-conf";
import * as actions from '../../../store/actions/index';
import {URL,DEFAULT_USER_AVATAR,DEFAULT_TEAM_AVATAR} from '../../../axios-conf';

class InfoTeam extends Component {

    state = {
        addUser: {
            value: '',
            valid: false,
            touched: false,
            validators: [required, email]
        },
        newUser:null
    };

    onChangeHandler = (event) => {
        let isValid = true;
        for (const validator of this.state.addUser.validators) {
            isValid = isValid && validator(event.target.value);
        }
        let newAddMail = {
            ...this.state.addUser,
            value: event.target.value,
            touched: true,
            valid: isValid
        };
        this.setState({addUser: newAddMail});
    };

    onAddMember=()=>{
        const data={
            idteam:this.props.team.id,
            email:this.state.addUser.value
        };
        const url='team/adduser';
        let options={
            method:'POST',
            url:url,
            data:data,
            headers: {
                'Authorization': `bearer ${this.props.token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        };
        axios(options).then(response =>{
            this.props.onSelectedTeam(this.props.token,this.props.team.id);
            message.success('New User',3);
        }).catch(err=>{
            message.error(err.response.data.error);
        });
    };

    render() {
        let img = this.props.team.avatar !== null ?
            <img alt='NI' src={URL + this.props.team.avatar} className={classes.TeamImage}/> :
            <img alt='NI' src={DEFAULT_TEAM_AVATAR} className={classes.TeamImage}/>;
        let list = <List bordered
                         itemLayout="horizontal"
                         dataSource={this.props.users}
                         renderItem={item => (
                             <List.Item actions={[<Icon className={classes.ListIcon} type="edit" theme="twoTone"/>,
                                 <Icon className={classes.ListIcon} type="delete" theme="twoTone"/>]}>
                                 <List.Item.Meta
                                     avatar={item.user.Avatar?<Avatar src={URL+ item.user.Avatar}/>:<Avatar src={DEFAULT_USER_AVATAR}/>}
                                     title={item.user.firstName + ' ' + item.user.lastName}
                                     description={item.roleUserTeams.map((value, key) => {
                                         return value.role.code;
                                     })}
                                 />
                             </List.Item>
                         )}/>;
        return (
            <div className={classes.InfoTeam}>
                <div className={classes.CoreInfo}>
                    {img}
                    <div>
                        <div className={classes.TeamName}>Info</div>
                        <Form  labelAlign='left' labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                            <Form.Item style={{marginBottom:'10px'}} label="Team name" >
                                <Input readOnly={true}  value={this.props.team.name}/>
                            </Form.Item>
                            <Form.Item style={{marginBottom:'10px'}} label="Creator" >
                                <Input readOnly={true} value={this.props.team.user.firstName+' '+this.props.team.user.lastName} />
                            </Form.Item>
                            <Form.Item style={{marginBottom:'10px'}} label="Created at" >
                                <Input readOnly={true} value={new Date(this.props.team.createdAt)}/>
                            </Form.Item>
                            <Form.Item style={{marginBottom:'10px'}} label="My Role" >
                                <Input readOnly={true} value={this.props.role.roleUserTeams[0].role.code}/>
                            </Form.Item>
                        </Form>
                    </div>

                </div>

                <div className={classes.ListUser}>
                    {list}
                </div>
                <div className={classes.NewUser}>
                    <Input onChange={(event) => {
                        this.onChangeHandler(event)
                    }} addonBefore='User Email' value={this.state.addUser.value}/>
                    <Button disabled={!this.state.addUser.valid} onClick={this.onAddMember}  className={classes.ConfirmButton} type='primary'>Add
                        User</Button>
                </div>

            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        loading: state.auth.loading,
        token: state.auth.token,
        error: state.team.error,
    }
};

const mapDispatchToProps=(dispatch)=>{
  return{
    onSelectedTeam:(token,id)=>dispatch(actions.selectedTeam(token,id))
  }
};




export default connect(mapStateToProps,mapDispatchToProps)(InfoTeam);