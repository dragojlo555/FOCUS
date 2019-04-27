import React,{Component,Fragment} from 'react';
import axios from "../../axios-conf";
import {connect} from "react-redux";
import TeamCard from './Team/Team';
import classes from './Teams.module.scss';

class Teams extends Component{

    componentDidMount() {
        const data= {
        };
        let url='team/myteams';
        let options={
            method:'POST',
            url:url,
            data:data,
            headers:{
                'Authorization': `bearer ${this.props.token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        };
        axios(options).then(response=> {
            console.log(response.data);
        }).catch(err=>{
            console.log(err.response);
        });
    }


    render(){
        return(
    <div className={classes.Teams}>
        <div className={classes.MenuTeams}>
           <TeamCard></TeamCard>
        </div>

        <div className={classes.ContentTeams}>

        </div>
    </div>
        );
    }
}

const mapStateToProps= state=>{
    return{
        loading:state.auth.loading,
        isAuthenticated: state.auth.token !=null,
        token:state.auth.token,
        error: state.auth.error
    }
};


const mapDispatchToProps= state=>{
    return{

    }
};

export default connect(mapStateToProps,mapDispatchToProps)(Teams);