import React, {Component} from "react";
import classes from "./TeamItem.module.scss";
import {DEFAULT_TEAM_AVATAR,URL} from '../../../../../axios-conf';
import {Avatar} from 'antd';

class TeamItem extends Component{
    render(){
        let pclass=classes.TeamCard;
        if(this.props.selectedId===this.props.team.team.id) {
            pclass = [classes.TeamCard, classes.SelectedTeamCard].join(' ');
        }
        return(
            <div className={pclass} onClick={this.props.onSelectedCard}>
                <Avatar size='small' src={this.props.team.team.avatar?URL+this.props.team.team.avatar:DEFAULT_TEAM_AVATAR}/>
                <div className={classes.TeamName}>{this.props.team.team.name}</div>
            </div>
        )
    }
}
export default TeamItem;