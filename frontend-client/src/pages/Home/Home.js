import React, {Component} from 'react';
import {connect} from "react-redux";
import './Home.module.scss';
import classes from './Home.module.scss';
import HomeMenu from './Menu/HomeMenu';
import ListUsers from './ListUsers/ListUsers';
import Chat from './Chat/Chat';
import {Route} from 'react-router-dom'
import ChangePassword from "../../components/Profile/ChangePassword/ChangePassword";

class Home extends Component {

    render() {
        return (<div className={classes.HomePage}>
            <div className={classes.MenuPage}>
                <HomeMenu></HomeMenu>
            </div>
            <div className={classes.ListUsersBlock}>
                <ListUsers/>
            </div>
            <div className={classes.ChatBox}>
                <Chat match={this.props.match} history={this.props.history}/>
            </div>
            <Route path={this.props.match.path + '/password/'}
                   render={(props) => <ChangePassword {...this.props}/>}/>
        </div>);
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        isAuthenticated: state.auth.token != null,
        error: state.auth.error,
        selectedTeam:state.team.selectedTeam
    }
};


const mapDispatchToProps = dispatch => {
    return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

