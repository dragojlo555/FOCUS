import React from "react";
import classes from "../Home/Home.module.scss";
import HomeMenu from "../Home/Menu/HomeMenu";
import ListUsers from "../Home/ListUsers/ListUsers";
import Chat from "../Home/Chat/Chat";



class Stock extends React{


    render(){


       return(
           <div className={classes.HomePage}>
               <div className={classes.MenuPage}>
                   <HomeMenu/>
               </div>
               <div className={classes.ListUsersBlock}>
                   <ListUsers/>
               </div>
               <div className={classes.ChatBox}>
                   <Chat match={this.props.match} history={this.props.history}/>
               </div>
           </div>
       )
    }




}

export default Stock;