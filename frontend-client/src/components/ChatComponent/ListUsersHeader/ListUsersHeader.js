import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../store/actions";
import classes from "../../../pages/Home/ListUsers/ListUsers.module.scss";
import {Avatar, Badge} from "antd";
import {DEFAULT_TEAM_AVATAR, URL} from "../../../axios-conf";


class ListUsersHeader extends Component {


    onSelectTeamChat = (team) => {
        this.props.onOpen('team', team, this.props.userId, this.props.token);
        this.props.onSeenTeamMessage(this.props.token, team.id);
    };

    render() {
        let headerClass = classes.HeaderList;
        if (this.props.chatType === 'team') {
            headerClass = [classes.HeaderList, classes.SelectedHeaderCard].join(' ');
        }
        let team = null;
        if (this.props.selectedTeam)
            team = <div onClick={() => {
                if (this.props.selectedTeam != null) this.onSelectTeamChat(this.props.selectedTeam.team)
            }} className={headerClass}>
                <Badge
                    count={(this.props.openedChat &&this.props.selectedTeam.team.id === this.props.openedChat.id && 'team' === this.props.chatType) ? 0 : this.props.unread[this.props.selectedTeam.team.id]}><Avatar
                    src={!this.props.selectedTeam.team.avatar ? DEFAULT_TEAM_AVATAR : URL + this.props.selectedTeam.team.avatar}/>
                </Badge>
                {this.props.selectedTeam ? this.props.selectedTeam.team.name : 'Name'}
            </div>;

        return (
            <>
                {team}
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        chatType: state.team.chatType,
        selectedTeam: state.team.selectedTeam,
        unread: state.team.teamUnread,
        openedChat: state.team.openedChat,
    }
};
const mapDispatchToProps = dispatch => {
    return {
        onOpen: (type, select, homeId, token) => dispatch(actions.openChat(type, select, homeId, token)),
        onSeenTeamMessage: (token, teamid) => dispatch(actions.setSeenTeamMessage(token, teamid)),
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(ListUsersHeader);