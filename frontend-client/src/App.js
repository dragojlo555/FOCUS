import React, {Component} from 'react';
import './App.module.scss';
import Login from './pages/Auth/Login/Login';
import Signup from './pages/Auth/Signup/Signup';
import Home from './pages/Home/Home';
import {Route, Switch, withRouter, Redirect} from 'react-router-dom';
import {connect} from "react-redux";
import * as actions from './store/actions/index';
import Layout from './components/Layout/Layout';
import Logout from './pages/Auth/Logout/Logout';
import Teams from './pages/Teams/Teams';
import 'antd/dist/antd.css';

class App extends Component {

    componentDidMount() {
        this.props.onTryAutoSignup();
    }

    render() {
        let routes = (
            <Switch>
                <Route path='/signup' component={Signup}/>
                <Route path='/' exact component={Login}/>
                <Redirect to='/'/>
            </Switch>
        );
        if (this.props.isAuthenticated) {
            routes = (
                    <Switch>
                        <Route path='/logout' component={Logout}/>
                        <Route path='/teams' component={Teams}/>
                        <Route path='/' exact component={Home}/>
                        <Redirect to='/'/>
                    </Switch>
            );
        }
        return (
            <Layout>
                {routes}
            </Layout>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignup: () => dispatch(actions.authCheckState())
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
