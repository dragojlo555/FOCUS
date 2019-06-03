import React, {Component} from 'react';
import TeamListMenu from './TeamListMenu/TeamListMenu';
import classes from './HomeMenu.module.scss';

class HomeMenu extends Component {

    render() {
        return (
            <div className={classes.HomeMenu}>
                <div className={classes.TeamName}>Teams</div>
                <TeamListMenu/>
            </div>
        )
    }
}

export default HomeMenu;