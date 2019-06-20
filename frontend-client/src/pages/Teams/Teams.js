import React, {Component, Fragment} from 'react';
import * as actions from '../../store/actions/index';
import {connect} from "react-redux";
import classes from './Teams.module.scss';
import Modal from '../../components/UI/Modal/Modal';
import NewTeam from './NewTeam/NewTeam';
import InfoTeam from './InfoTeam/InfoTeam';
import {Button} from 'antd';
import HomeMenu from '../Home/Menu/HomeMenu';
class Teams extends Component {

    state = {
        creatingTeam: false,
        selectedTeamId: null
    };

    componentDidMount() {
        this.props.onGetMyTeams(this.props.token);
    }

    closeCreateTeamHandler = () => {
        this.setState({creatingTeam: false})
    };

    createTeamHandler = () => {
        this.setState({creatingTeam: true})
    };

    render() {
        let info = this.props.selectedTeam ?
            <InfoTeam team={this.props.selectedTeam.team} role={this.props.selectedTeam.myRole}
                      users={this.props.selectedTeam.teamUsers}/> : null;
        return (
            <Fragment>
                <Modal show={this.state.creatingTeam} cancel={this.closeCreateTeamHandler}>
                    <NewTeam cancel={this.closeCreateTeamHandler}/>
                </Modal>
                <div className={classes.Teams}>
                    <div className={classes.MenuTeams}>
                       <HomeMenu/>
                        <div>
                            <Button type="primary" size='large' onClick={this.createTeamHandler}>New Team</Button>
                        </div>
                    </div>
                    <div className={classes.ContentTeams}>
                        {info}
                    </div>
                </div>
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
        onSelectedTeam: (id, token) => dispatch(actions.selectedTeam(token, id))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Teams);