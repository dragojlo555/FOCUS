import React,{Component} from 'react';
import classes from './TeamMenuCard.module.scss'
import {DEFAULT_TEAM_AVATAR,URL} from '../../../axios-conf';
class TeamMenuCard extends Component{
    render(){
        let img=null;
        let pclass=classes.TeamCard;
        if(this.props.selectedId===this.props.team.team.id) {
            console.log(this.props.selectedId,' ',this.props.team.team.id);
             pclass = [classes.TeamCard, classes.SelectedTeamCard].join(' ');
        }
        if(this.props.team.team.avatar!==null){
           img= <img alt='NI' src={URL+this.props.team.team.avatar} className={classes.TeamAvatar}/>
        }else{
           img= <img alt='NI' src={DEFAULT_TEAM_AVATAR} className={classes.TeamAvatar}/>}
        return(
            <div className={pclass} onClick={this.props.onSelectedCard}>
                {img}
                <div className={classes.TeamName}>{this.props.team.team.name}</div>
            </div>
        )
    }
}


export default TeamMenuCard;