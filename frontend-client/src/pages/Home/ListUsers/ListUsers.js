import React, {Component} from 'react';
import * as actions from "../../../store/actions/index";
import {connect} from "react-redux";
import {Badge, Avatar,} from "antd";
import {URL, DEFAULT_USER_AVATAR, DEFAULT_TEAM_AVATAR} from '../../../axios-conf';
import classes from './ListUsers.module.scss';

class ListUsers extends Component {

    state={
      selectedUser:null
    };

    changeState=(data)=>{

        if(this.props.selectedTeam!==null)
        this.props.onSelectedTeam(this.props.token,this.props.selectedTeam.team.id);
    };

    componentDidMount() {
        this.props.socket.on('change-state',this.changeState)
    }

    componentWillUnmount() {
        this.props.socket.off('change-state');
    }

    onSelectUser=(user)=>{
        this.setState({selectedUser:user});
        this.props.onOpenChat('user',user);
    };

    onSelectTeamChat=(team)=>{
        this.props.onOpenChat('team',team);
    };

    render() {

        const users = this.props.selectedTeam != null ? this.props.selectedTeam.teamUsers.map((value, key) => {
            let userClass=classes.UserCard;
            let status=value.user.focu.state==='work'?'error':value.user.focu.state!=='pause'?'success':'warning';
            if(this.state.selectedUser && this.state.selectedUser.id===value.user.id) {
                userClass = [classes.UserCard, classes.SelectedUserCard].join(' ');
            }
            return <div onClick={()=>{this.onSelectUser(value.user)}} key={value.user.id} className={userClass}><Badge status={status} >
                <Avatar shape="square" src={value.user.Avatar?URL + value.user.Avatar:DEFAULT_USER_AVATAR}/>
            </Badge><span style={{marginLeft:'10px'}}>{value.user.firstName + ' ' + value.user.lastName}</span>
            </div>
        }) : null;
        return (
            <div className={classes.ListUsers}>
                <div onClick={()=>{this.onSelectTeamChat(this.props.selectedTeam.team)}} className={classes.HeaderList}><Avatar src={DEFAULT_TEAM_AVATAR}/>{this.props.selectedTeam?this.props.selectedTeam.team.name:'Name'}</div>
                {users}
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        loading: state.team.loading,
        isAuthenticated: state.auth.token != null,
        token: state.auth.token,
        myTeams: state.team.myTeams,
        selectedTeam: state.team.selectedTeam,
        socket: state.auth.socket
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onGetMyTeams: (token) => dispatch(actions.getMyTeams(token)),
        onOpenChat:(type,selectChat)=>dispatch(actions.openChat(type,selectChat)),
        onSelectedTeam:(token,id)=>dispatch(actions.selectedTeam(token,id))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ListUsers);