import React, {Component} from 'react';
import classes from './TeamListMenu.module.scss';
import * as actions from "../../../../store/actions"
import {connect} from 'react-redux';
import TeamItem from "./TeamItem/TeamItem";

class TeamListMenu extends Component {

    componentDidMount() {
        this.props.onGetMyTeams(this.props.token);
    }

    onSelect = (selectedKeys, openChat) => {
        this.props.onSelectedTeam(this.props.token, selectedKeys, openChat);
    };


    render() {
          if(this.props.myTeams){if(this.props.selectedTeam===null){this.props.onSelectedTeam(this.props.token,this.props.myTeams[0].team.id,true)}}
        let teams = this.props.myTeams && this.props.selectedTeam !== null ? this.props.myTeams.map((value, key) => {
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
        onSelectedTeam: (token, id, openChat) => dispatch(actions.selectedTeam(token, id, openChat))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamListMenu);