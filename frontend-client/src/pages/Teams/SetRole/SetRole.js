import React,{Component} from "react";
import { Modal,Radio} from 'antd';
import {connect} from "react-redux";
import classes from './SetRole.module.scss';
import axios from "../../../axios-conf";
import * as actions from "../../../store/actions";


class SetRole extends Component{

    state={
      visible:true,
        value:1,
        creatorDisable:true,
        standardDisable:false,
        adminDisable:false,
        loading:false,
        user:null
    };

    componentDidMount() {
       let userId=parseInt(this.props.match.params.id);
       let user;
        this.props.users.forEach((value,key)=>{
          if(value.user.id===userId){
              user=value;
          }
        });
        if(user) {
            const userRole = user.roleUserTeams[0].role.code;
            if (userRole === 'Creator') {
                this.setState({user:user,value: 1, adminDisable: true, standardDisable: true, creatorDisable: false});
            } else if (userRole === 'Admin') {
                this.setState({user:user,value: 3});
            } else {
                this.setState({user:user,value: 2});
            }
        }
    }

    handleModalOk=()=>{
        this.setState({visible:false});
    };

    handleChangeRadio=(e)=>{

        const url='team/role';
        const data={
            idrole:e.target.value,
            oldidrole:this.state.value,
            idteamuser:this.state.user.id
        };

        let options={
            method:'PUT',
            url:url,
            data:data,
            headers: {
                'Authorization': `bearer ${this.props.token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        };
        axios(options).then(response=>{
            this.props.onSelectedTeam(this.props.token,this.props.selectedTeam.team.id,false);
        }).catch(error=> {
            console.log(error.response);
        });

        this.handleModalClose();
    };

    componentDidUpdate(prevProps, prevState, snapshot) {

        if(prevState.visible===true && this.state.visible===false){
            setTimeout( ()=>{this.props.history.push('/teams')},500);
        }
    }

    handleModalClose=()=>{
        this.setState({visible:false});
    };

    render(){

        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        return(
           <Modal
               title="Change role"
               visible={this.state.visible}
               onOk={this.handleModalOk}
               onCancel={this.handleModalClose}
               okText='Ok'
           >
               <div className={classes.SetRole}>
                   <Radio.Group onChange={this.handleChangeRadio} value={this.state.value}>
                       <Radio style={radioStyle} value={1} disabled={this.state.creatorDisable}>
                         Creator
                       </Radio>
                       <Radio style={radioStyle} value={2} disabled={this.state.standardDisable}>
                           Standard
                       </Radio>
                       <Radio style={radioStyle} value={3} disabled={this.state.adminDisable}>
                           Admin
                       </Radio>
                   </Radio.Group>
               </div>
           </Modal>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        selectedTeam: state.team.selectedTeam
    }
};

const mapDispatchToPros = dispatch => {
    return {
        onSelectedTeam:(token,id,openChat)=>dispatch(actions.selectedTeam(token,id,openChat))
    }
};


export default connect(mapStateToProps, mapDispatchToPros)(SetRole);