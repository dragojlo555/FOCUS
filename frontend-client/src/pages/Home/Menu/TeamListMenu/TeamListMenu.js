import React, {Component} from 'react';
import classes from './TeamListMenu.module.scss';
import * as actions from "../../../../store/actions"
import {connect} from 'react-redux';
import TeamItem from "./TeamItem/TeamItem";

class TeamListMenu extends Component {

    componentDidMount() {
        this.props.onGetMyTeams(this.props.token);
    }

    onSelect = (selectedKey, openChat) => {
        this.props.onSelectedTeam(this.props.token, selectedKey, openChat);
        this.props.onSeenTeamMessage(this.props.token,selectedKey);
        this.props.onGetTeamUnread(this.props.token,selectedKey);
    };


    render() {
          if(this.props.myTeams){if(this.props.selectedTeam===null && this.props.myTeams.length>0){this.props.onSelectedTeam(this.props.token,this.props.myTeams[0].team.id,true)}}
        let teams = this.props.myTeams && this.props.selectedTeam !== null ? this.props.myTeams.map((value, key) => {
            this.props.onGetTeamUnread(this.props.token,value.team.id);
            return <TeamItem key={key} selectedId={this.props.selectedTeam.team.id} team={value} onSelectedCard={() => {
                this.onSelect(value.team.id, true)
            }}/>
        }) : null;
        return (
            <div className={classes.TeamListMenu}>
                {teams}
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
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onGetMyTeams: (token) => dispatch(actions.getMyTeams(token)),
        onSelectedTeam: (token, id, openChat) => dispatch(actions.selectedTeam(token, id, openChat)),
        onSeenTeamMessage:(token,teamid)=>dispatch(actions.setSeenTeamMessage(token,teamid)),
        onGetTeamUnread:(token,teamid)=>dispatch(actions.getUnreadTeamMessage(token,teamid))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamListMenu);