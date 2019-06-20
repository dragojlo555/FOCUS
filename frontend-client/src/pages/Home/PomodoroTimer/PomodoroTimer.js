import React, {Component} from 'react';
import CircularProgessBar from "../../../components/ProgressBar/CircularProgressBar/CircularProgressBar";
import classes from './PomodoroTimer.module.scss'
import SetDuration from '../../../components/TimerComponents/SetDuration/SetDuration';
import CommandButton from "../../../components/TimerComponents/CommandButton/CommandButton";
import {connect} from 'react-redux';
import * as actions from "../../../store/actions";
import {Modal,Button} from 'antd';

class PomodoroTimer extends Component {
    state = {
        visible:false,
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

    changeDurationHandler=(type,duration)=>{
        let updatedBreak = this.props.duration[type];
        updatedBreak = updatedBreak + duration;
        const updatedDuration = {
            ...this.props.duration,

        };
        updatedDuration[type]=updatedBreak;
        this.props.onSetDuration(updatedDuration);
    };

    pauseSession = () => {
        let timer = this.props.session.timer;
        console.log(timer);
        clearInterval(timer);console.log(timer);
        if (timer != null) {
            clearInterval(timer);
        }
    };

    resetSession = () => {
       let timer=this.props.session.timer;
       clearInterval(timer);
        const updatedSession = {
            ...this.props.session,
            time: 0,
            startTime: null,
            endTime: null,
            number: 1,
            current: 'work'
        };
        this.props.onSetSession(updatedSession);
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
        let timerOld=this.props.session.timer;
        clearInterval(timerOld);
        this.props.onChangeMyState(this.props.token,this.props.session.current);
        let curSession = this.props.session.current;
        let maxDur = this.props.duration[curSession] * 60;
        let updatedTime = this.props.session.time;
        let number = this.props.session.number;
        let startTime=this.props.session.startTime;
        let endTime=this.props.session.endTime;

        if(updatedTime===0){
             startTime=new Date();
            endTime=new Date(new Date().getTime() + (this.props.duration[curSession] * 60*1000));
        }
        const timer = setInterval(() => {
            maxDur = this.props.duration[curSession] * 60;
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
                    clearInterval(this.props.session.timer);
                    if (number === 3) {
                        number = 1;
                    } else {
                        number = number + 1;
                    }
                }
            }

            if(timer!==null && timer!==this.props.session.timer){
                clearInterval(this.props.session.timer);
            }
            const updatedSession = {
                ...this.props.session,
                time: updatedTime,
                timer: timer,
                current: curSession,
                number: number,
                startTime:startTime,
                endTime: endTime
            };
            this.props.onSetSession(updatedSession);
        }, 1000);
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    render() {
        return (
            <div className={classes.PomodoroTimer} >
                <div className={classes.Timer} >
                    <CircularProgessBar control={this.showModal} start={this.startSession} reset={this.resetSession} pause={this.pauseSession} duration={this.props.duration} session={this.props.session}/>
                </div>
                {  this.state.visible? <Modal
                    title="Timer Configuration"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key='okModalButton'  type="primary"  onClick={this.handleOk}>
                           Ok
                        </Button>,
                    ]}
                >
                    <div className={classes.Duration}>
                        <SetDuration clasName={classes.SetDuration} incDuration={()=>{this.changeDurationHandler('work',1)}} decDuration={()=>{this.changeDurationHandler('work',-1)}}
                                     label={'Work duration'} time={this.props.duration.work}/>
                        <SetDuration clasName={classes.SetDuration} incDuration={()=>{this.changeDurationHandler('pause',1)}} decDuration={()=>{this.changeDurationHandler('pause',-1)}}
                                     label={'Pause duration'} time={this.props.duration.pause}/>
                        <SetDuration clasName={classes.SetDuration} incDuration={()=>{this.changeDurationHandler('break',1)}} decDuration={()=>{this.changeDurationHandler('break',-1)}}
                                     label={'Break duration'} time={this.props.duration.break}/>
                        <CommandButton start={this.startSession} reset={this.resetSession} pause={this.pauseSession}/>
                    </div>
                </Modal> :null}
            </div>
        );
    }
}
const mapStateToProps=(state)=>{
  return {
    token:state.auth.token,
      session:state.pomodoro.session,
      duration:state.pomodoro.duration
  }
};

const mapDispatchToProps=(dispatch)=>{
    return{
        onSetSession:(session)=>dispatch(actions.setPomodoroTimerSession(session)),
        onSetDuration:(duration)=>dispatch(actions.setPomodoroTimerDuration(duration)),
        onChangeMyState: (token,state) => dispatch(actions.changeMyState(token,state)),
    }
};
export default connect(mapStateToProps,mapDispatchToProps)(PomodoroTimer);