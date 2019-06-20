import React, { Component,Fragment } from 'react';
import classesLayout from './Layout.module.scss';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import {connect} from 'react-redux';

class Layout extends Component {

    state = {
        showSideDrawer: false
    };

    sideDrawerClosedHandler = () => {
        this.setState({ showSideDrawer: false });
    };

    sideDrawerToggleHandler = () => {
        this.setState((prevState)=>{
            return {showSideDrawer: !prevState.showSideDrawer}
        });
    };

    render() {
        return (
            <Fragment>
                <Toolbar
                    user={this.props.user}
                    isAuth={this.props.isAuthenticated}
                    drawerToogleClicked={this.sideDrawerToggleHandler}/>
                <SideDrawer
                    isAuth={this.props.isAuthenticated}
                    closed={this.sideDrawerClosedHandler} open={this.state.showSideDrawer}/>
                <main className={classesLayout.Content}>
                    {this.props.children}
                </main>
            </Fragment>

        );
    }
}

const mapStateToProps =state =>{
    return {
        isAuthenticated:state.auth.token !== null,
        user:state.auth.user
    };
};
export default connect(mapStateToProps)(Layout);