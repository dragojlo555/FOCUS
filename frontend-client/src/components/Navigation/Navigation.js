import React, {Component} from 'react';
import NavigationItem from './NavigationItem/NavigationItem';
import classes from './Navigation.module.scss';
import {Avatar,Menu,Icon} from 'antd';
import {DEFAULT_USER_AVATAR,URL} from '../../axios-conf'
import { Modal } from 'antd';
import EditProfile from '../../components/Profile/EditProfile/EditProfile';


const {SubMenu}=Menu;

class NavigationItems extends Component{

    rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];

    state = {
        openKeys: ['sub2'],
        visibleProfile:false,
        visibleSettings:false,
        callModalProfile:0
    };

    onOpenChange = openKeys => {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({ openKeys });
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    };

    handleLogout=()=>{
        this.props.logout();
        this.setState({
            openKeys: [],
        });

    };

    handleChangeProfileModal=()=>{
        this.setState({visibleProfile:true,callModalProfile:this.state.callModalProfile+1});
    };

    handleOkChangeProfile=()=>{
        this.setState({visibleProfile:false});
    };
    handleCancelChangeProfile=()=>{
        this.setState({visibleProfile:false});
    };

    //Settings
    handleChangeSettingsModal=()=>{
        this.setState({visibleSettings:true});
    };

    handleOkChangeSettings=()=>{
        this.setState({visibleSettings:false});
    };

    handleCancelChangeSettings=()=> {
        this.setState({visibleSettings: false});
    };

render() {
    let component = null;
    let menuClass=classes.Menu;
   if(this.props.drawer===true){
       menuClass=classes.MenuDrawer;
   }
    if (this.props.isAuthenticated) {
        let me=this.props.user ? <>
            <Avatar src={this.props.user.avatar ? URL + this.props.user.avatar : DEFAULT_USER_AVATAR}/>
            <span>{this.props.user.firstName + ' ' + this.props.user.lastName}</span>
        </> : null;

        component = <>
            <NavigationItem link="/" exact>Home</NavigationItem>
            <NavigationItem link='/teams'>Teams</NavigationItem>
            { /* <NavigationItem link='/logout'>Logout</NavigationItem>*/}
            <Menu
                className={menuClass}
                theme={this.props.drawer===true?'light':'dark'}
                mode="inline"
                openKeys={this.state.openKeys}
                onOpenChange={this.onOpenChange}
            >
                <SubMenu
                          key="sub1"
                          title={
                              <span>
                            {me}
                        </span>
                          }
                >
                    <Menu.Item key="1" onClick={this.handleChangeSettingsModal}><><Icon type='setting'/>Settings</></Menu.Item>
                    <Menu.Item key="2" onClick={this.handleChangeProfileModal}><><Icon type='profile'/>profile</></Menu.Item>
                    <Menu.Item key="3" onClick={this.handleLogout}><><Icon type='logout'/>Logout</></Menu.Item>
                </SubMenu>
            </Menu>
        </>
    } else {
        component = <>
            <NavigationItem exact link='/'>Log In</NavigationItem>
            <NavigationItem link='/signup'>Sign Up</NavigationItem>
        </>
    }

    return (
        <ul className={classes.Navigation}>
            <>
                <EditProfile count={this.state.callModalProfile}  visible={this.state.visibleProfile} handleOk={this.handleOkChangeProfile} handleCancel={this.handleCancelChangeProfile}/>
                <Modal
                    title="Settings"
                    visible={this.state.visibleSettings}
                    onOk={this.handleOkChangeSettings}
                    onCancel={this.handleCancelChangeSettings}
                    okText='Save'
                >
                </Modal>
            {component}
            </>
        </ul>
    )
}

}
//exact postavljeno da ne kupi NavLink da su oba aktivna
export default NavigationItems;