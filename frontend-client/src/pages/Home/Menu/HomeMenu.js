import React, {Component} from 'react';
import TeamListMenu from './TeamListMenu/TeamListMenu';
import classes from './HomeMenu.module.scss';
import PomodoroTimer from "../PomodoroTimer/PomodoroTimer";

class HomeMenu extends Component {

    render() {
        return (
            <div className={classes.HomeMenu}>
                <div className={classes.Timer}><PomodoroTimer/></div>
                <div className={classes.TeamName}>Teams</div>
                <TeamListMenu/>
            </div>
        )
    }
}

export default HomeMenu;