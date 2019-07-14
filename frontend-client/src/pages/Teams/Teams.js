import React, {Component, Fragment} from 'react';
import * as actions from '../../store/actions/index';
import {connect} from "react-redux";
import classes from './Teams.module.scss';
//import Modal from '../../components/UI/Modal/Modal';
import NewTeam from './NewTeam/NewTeam';
import InfoTeam from './InfoTeam/InfoTeam';
import {Button} from 'antd';
import HomeMenu from '../Home/Menu/HomeMenu';
class Teams extends Component {

    state = {
        selectedTeamId: null,
        visible:false
    };

    componentDidMount() {
        this.props.onGetMyTeams(this.props.token);
    }

    handleCreateTeamClose = () => {
        this.setState({visible: false})
    };

    handleCreateTeam = () => {
        this.setState({visible: true})
    };

    render() {
        let info = this.props.selectedTeam ?
            <InfoTeam match={this.props.match} history={this.props.history} team={this.props.selectedTeam.team} role={this.props.selectedTeam.myRole}
                      users={this.props.selectedTeam.teamUsers}/> : null;
        return (
            <Fragment>
                <div className={classes.Teams}>
                    <div className={classes.MenuTeams}>
                       <HomeMenu/>
                        <div className={classes.NewTeamButton}>
                            <Button type="primary" size='large' onClick={this.handleCreateTeam}>New Team</Button>
                        </div>
                    </div>
                    <div className={classes.ContentTeams}>
                        {info}
                    </div>
                </div>
                <NewTeam visible={this.state.visible}  handleClose={this.handleCreateTeamClose}/>
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        isAuthenticated: state.auth.token != null,
        token: state.auth.token,
        error: state.auth.error,
        myTeams: state.team.myTeams,
        selectedTeam: state.team.selectedTeam
    }
};


const mapDispatchToProps = dispatch => {
    return {
        onGetMyTeams: (token) => dispatch(actions.getMyTeams(token)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Teams);