import classes from "../Home/Home.module.scss";
import HomeMenu from "../Home/Menu/HomeMenu";
import StockList from "./StockList/StockList";
import StockPage from "./StockPage/StockPage";
import React, {Component} from "react";
import ChangePassword from "../../components/Profile/ChangePassword/ChangePassword";


class Stock extends Component{
    render(){
        return (<div className={classes.HomePage}>
            <div className={classes.MenuPage}>
                <HomeMenu/>
            </div>
            <div className={classes.ListUsersBlock}>
                    <StockList/>
            </div>
            <div className={classes.ChatBox}>

            </div>
        </div>);

    }




}

export default Stock;