import React,{Component} from 'react';
import classes from './Team.module.scss'

class Team extends Component{

    render(){
        return(
            <div className={classes.TeamCard}>
                <img className={classes.TeamAvatar} />
                <p className={classes.TeamName}></p>
            </div>
        )
    }

};


export default Team;