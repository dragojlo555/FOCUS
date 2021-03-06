import React,{Component} from 'react';
import * as actions from '../../../store/actions/index';
import {connect} from "react-redux";
import {Redirect} from 'react-router-dom';



class Logout extends Component{

    componentDidMount() {
        this.props.onLogout();
        this.props.onTeamLogout();
    }

    render(){
            return <Redirect to='/'/>
    }
}

const mapStateToPros=state=>{
    return{

    }
};

const mapDispatchToProps= dispatch=>{
    return{
        onLogout:()=>dispatch(actions.logout()),
    }
};

export default connect(mapStateToPros,mapDispatchToProps)(Logout);