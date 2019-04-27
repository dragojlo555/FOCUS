import React,{Component} from 'react';
import {connect} from "react-redux";
import './Home.module.scss';
import classes from './Home.module.scss';
import PomodoroTimer from "./PomodoroTimer/PomodoroTimer";


class Home extends  Component{

  render(){
      return(<div className={classes.HomePage}>
            <PomodoroTimer/>
            </div>);
            }
}

const mapStateToProps= state=>{
  return{
      loading:state.auth.loading,
      isAuthenticated: state.auth.token !=null,
      error: state.auth.error
  }
};


const mapDispatchToProps= state=>{
  return{

  }
};

export default connect(mapStateToProps,mapDispatchToProps)(Home);

