import React, {Component} from 'react';
import classes from './InfoTeam.module.scss';
import {List,Modal, Avatar, Button, Input, Icon, Form,message} from 'antd';
import {email, required} from "../../../util/validators/validators";
import {connect} from "react-redux";
import axios from "../../../axios-conf";
import * as actions from '../../../store/actions/index';
import {URL,DEFAULT_USER_AVATAR,DEFAULT_TEAM_AVATAR} from '../../../axios-conf';
import {Route} from 'react-router-dom';
import SetRole from '../SetRole/SetRole';

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
            let newAddMail = {
                ...this.state.addUser,
                value: '',
                touched: true,
                valid: false
            };
            this.setState({addUser: newAddMail});

        }).catch(err=>{
            message.error(err.response.data.error);

        });
    };

    handleSuccessDelete=()=>{
        this.props.onSelectedTeam(this.props.token,this.props.team.id,false);
    };
    handleDeleteUser=(idUser,idTeam,token,func)=>{
        Modal.confirm({
            title: 'Do you Want to delete user?',
            content: 'Delete user',
            onOk() {
                console.log(idUser,idTeam);
                const data={
                    iduser:idUser,
                    idteam:idTeam
                };
                let url='/team/user';
                let options={
                    method:'DELETE',
                    url:url,
                    data:data,
                    headers:{
                        'Authorization': `bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                };
                axios(options).then(response =>{
                    console.log(response.data);
                    func();
                }).catch(err=>{
                   message.error(err.response.data.msg,3);
                });
            },
            onCancel() {
               // console.log('Cancel');
            },
        });
    };

    handleChangeRole=(id)=>{
        this.props.history.push('/teams/role/'+id);
    };

    render() {
        let img = this.props.team.avatar !== null ?
            <img alt='NI' src={URL + this.props.team.avatar} className={classes.TeamImage}/> :
            <img alt='NI' src={DEFAULT_TEAM_AVATAR} className={classes.TeamImage}/>;
        let list = <List bordered
                         itemLayout="horizontal"
                         dataSource={this.props.users}
                         renderItem={item => (
                             <List.Item actions={
                             this.props.role.roleUserTeams.map((value,key)=>{
                                 if(value.role.code==='Admin' || value.role.code==='Creator'){
                                 return    [<Icon key={item.user.id+'change'} className={classes.ListIcon} onClick={()=>{this.handleChangeRole(item.user.id)}} type="edit" theme="twoTone"/>,
                                         <Icon  key={item.user.id+'delete'} className={classes.ListIcon}  onClick={()=>{this.handleDeleteUser(item.user.id,this.props.team.id,this.props.token,()=>{this.handleSuccessDelete()})}}    type="delete" theme="twoTone"/>]
                                 }
                                 return null;
                             })
                             }>
                                 <List.Item.Meta
                                     avatar={item.user.avatar?<Avatar src={URL+ item.user.avatar}/>:<Avatar src={DEFAULT_USER_AVATAR}/>}
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
                                <Input readOnly={true} value={new Date(this.props.team.createdAt).toLocaleString()}/>
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
                    }} addonBefore='User Email' placeholder='email@address.com' value={this.state.addUser.value}/>
                    <Button disabled={!this.state.addUser.valid ||  !(this.props.role.roleUserTeams[0].role.code==='Creator' ||  this.props.role.roleUserTeams[0].role.code==='Admin')} onClick={this.onAddMember}  className={classes.ConfirmButton} type='primary'>Add
                        User</Button>
                </div>
                <Route path={this.props.match.path+'/role/:id'} render={(props)=><SetRole match={this.props.match} users={this.props.users} roles={this.props.role.roleUserTeams}{...props}/>}/>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        loading: state.auth.loading,
        token: state.auth.token,
        error: state.team.error,
        myTeams: state.team.myTeams
    }
};

const mapDispatchToProps=(dispatch)=>{
  return{
    onSelectedTeam:(token,id,openChat)=>dispatch(actions.selectedTeam(token,id,openChat))
  }
};




export default connect(mapStateToProps,mapDispatchToProps)(InfoTeam);