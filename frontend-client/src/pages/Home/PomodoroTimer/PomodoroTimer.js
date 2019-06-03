import React, {Component} from 'react';
import CircularProgessBar from "../../../components/ProgressBar/CircularProgressBar/CircularProgressBar";
import classes from './PomodoroTimer.module.scss'
import SetDuration from '../../../components/TimerComponents/SetDuration/SetDuration';
import CommandButton from "../../../components/TimerComponents/CommandButton/CommandButton";
import {connect} from 'react-redux';
import * as actions from "../../../store/actions";
import {Modal} from 'antd';

class PomodoroTimer extends Component {
    state = {
        duration: {
            work: 10,
            pause: 5,
            break: 30
        },
        session: {
            current: 'work',
            number: 1,
            startTime: null,
            endTime: null,
            time: 0,
            timer: null
        }
    };

    componentDidMount() {
       const storageState=JSON.parse(localStorage.getItem('timer'));
        if(storageState!=null) {
            this.setState({session: storageState.session, duration: storageState.duration}, this.startSession);
            this.props.onChangeMyState(this.props.token,storageState.session.current);
        }
    }
    componentWillUnmount() {
        let timer=this.state.session.timer;
        localStorage.setItem('timer',JSON.stringify(this.state));
        clearInterval(timer);
    }

    changeDurationHandler=(type,duration)=>{
        let updatedBreak = this.state.duration[type];
        updatedBreak = updatedBreak + duration;
        const updatedDuration = {
            ...this.state.duration,

        };
        updatedDuration[type]=updatedBreak;
        this.setState({duration: updatedDuration})
    };

    pauseSession = () => {
        let timer = this.state.session.timer;
        console.log(timer);
        if (timer != null) {
            clearInterval(timer);
        }
    };

    resetSession = () => {
       let timer=this.state.session.timer;
       clearInterval(timer);
        const updatedSession = {
            ...this.state.session,
            time: 0,
            startTime: null,
            endTime: null,
            number: 1,
            current: 'work'
        };
        this.setState({session: updatedSession});
    };

     info=(state,msg,method)=>{
        Modal.info({
            title: 'The '+state+' time is over !!!',
            content: (
                <div>
                    <p>{msg}</p>
                </div>
            ),
            onOk() {method()},
        });
    };

    startSession = () => {
        this.props.onChangeMyState(this.props.token,this.state.session.current);
        let curSession = this.state.session.current;
        let maxDur = this.state.duration[curSession] * 60;
        let updatedTime = this.state.session.time;
        let number = this.state.session.number;
        let startTime=this.state.session.startTime;
        let endTime=this.state.session.endTime;

        if(updatedTime===0){
             startTime=new Date();
            endTime=new Date(new Date().getTime() + (this.state.duration[curSession] * 60*1000));
        }

        const timer = setInterval(() => {
            maxDur = this.state.duration[curSession] * 60;
            updatedTime = updatedTime + 1;
            if (updatedTime === maxDur) {
                clearInterval(timer);
                updatedTime = 0;
                if (curSession === 'work') {
                    curSession = 'pause';
                    this.info('work','Take a pause!!!',this.startSession);
                } else if (curSession === 'pause') {
                    curSession = 'break';
                    this.info('pause','Take a break!!!',this.startSession);
                } else {
                    curSession = 'work';
                    this.info('break','Go to work!!!',this.startSession);
                    clearInterval(this.state.session.timer);
                    if (number === 3) {
                        number = 1;
                    } else {
                        number = number + 1;
                    }
                }
            }
            const updatedSession = {
                ...this.state.session,
                time: updatedTime,
                timer: timer,
                current: curSession,
                number: number,
                startTime:startTime,
                endTime: endTime
            };
            this.setState({session: updatedSession});
        }, 1000);
    };




    render() {
        return (
            <div className={classes.PomodoroTimer}>
                <div className={classes.Timer}>
                    <CircularProgessBar duration={this.state.duration} session={this.state.session}/>
                </div>
                <div className={classes.Duration}>
                    <SetDuration incDuration={()=>{this.changeDurationHandler('work',1)}} decDuration={()=>{this.changeDurationHandler('work',-1)}}
                                 label={'Work duration'} time={this.state.duration.work}/>
                    <SetDuration incDuration={()=>{this.changeDurationHandler('pause',1)}} decDuration={()=>{this.changeDurationHandler('pause',-1)}}
                                 label={'Pause duration'} time={this.state.duration.pause}/>
                    <SetDuration incDuration={()=>{this.changeDurationHandler('break',1)}} decDuration={()=>{this.changeDurationHandler('break',-1)}}
                                 label={'Break duration'} time={this.state.duration.break}/>
                    <CommandButton start={this.startSession} reset={this.resetSession} pause={this.pauseSession}/>
                </div>
            </div>
        );
    }
}
const mapStateToProps=(state)=>{
  return {
    token:state.auth.token
  }
};

const mapDispatchToProps=(dispatch)=>{
    return{
        onChangeMyState: (token,state) => dispatch(actions.changeMyState(token,state)),
    }
};
export default connect(mapStateToProps,mapDispatchToProps)(PomodoroTimer);