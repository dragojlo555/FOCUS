import React, {Component} from 'react';
import CircularProgessBar from "../../../components/ProgressBar/CircularProgressBar/CircularProgressBar";
import classes from './PomodoroTimer.module.scss'
import SetDuration from '../../../components/TimerComponents/SetDuration/SetDuration';
import CommandButton from "../../../components/TimerComponents/CommandButton/CommandButton";

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
        }
    }
    componentWillUnmount() {
        let timer=this.state.session.timer;
        localStorage.setItem('timer',JSON.stringify(this.state));
        clearInterval(timer);
    }

    incBreakDurationHandler = () => {
        let updatedBreak = this.state.duration['break'];
        updatedBreak = updatedBreak + 1;
        const updatedDuration = {
            ...this.state.duration,
            break: updatedBreak
        };
        this.setState({duration: updatedDuration})
    };

    decBreakDurationHandler = () => {
        let updatedBreak = this.state.duration['break'];
        updatedBreak = updatedBreak - 1;
        const updatedDuration = {
            ...this.state.duration,
            break: updatedBreak
        };
        this.setState({duration: updatedDuration});
    };


    incPauseDurationHandler = () => {
        let updatedPause = this.state.duration['pause'];
        updatedPause = updatedPause + 1;
        const updatedDuration = {
            ...this.state.duration,
            pause: updatedPause
        };
        this.setState({duration: updatedDuration})
    };

    decPauseDurationHandler = () => {
        let updatedPause = this.state.duration['pause'];
        updatedPause = updatedPause - 1;
        const updatedDuration = {
            ...this.state.duration,
            pause: updatedPause
        };
        this.setState({duration: updatedDuration});
    };

    decWorkDuration = () => {
        let updatedWork = this.state.duration['work'];
        updatedWork = updatedWork - 1;
        const updatedDuration = {
            ...this.state.duration,
            work: updatedWork
        };
        this.setState({duration: updatedDuration});
    };

    incWorkDuration = () => {
        let updatedWork = this.state.duration['work'];
        updatedWork = updatedWork + 1;
        const updatedDuration = {
            ...this.state.duration,
            work: updatedWork
        };
        this.setState({duration: updatedDuration});
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

    startSession = () => {
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

        if (updatedTime === maxDur) {
            updatedTime = 0;
            if (curSession === 'work') {
                curSession = 'pause';
            } else if (curSession === 'pause') {
                curSession = 'break';
            } else {
                curSession = 'work';
                if (number === 3) {
                    number = 1;
                } else {
                    number = number + 1;
                }
            }
            const updatedSession = {
                ...this.state.session,
                current: curSession,
                time: updatedTime,
                number: number,
                startTime:startTime,
                endTime: endTime
            };
            this.setState({session: updatedSession});

        }

        const timer = setInterval(() => {
            maxDur = this.state.duration[curSession] * 60;
            updatedTime = updatedTime + 1;
            if (updatedTime === maxDur) {
                clearInterval(timer);
            }
            const updatedSession = {
                ...this.state.session,
                time: updatedTime,
                timer: timer
            };
            this.setState({session: updatedSession});
        }, 1000);
    };

    render() {
        return (
            <div className={classes.PomodoroTimer}>
                <div className={classes.Duration}>
                    <SetDuration incDuration={this.incWorkDuration} decDuration={this.decWorkDuration}
                                 label={'Work duration'} time={this.state.duration.work}/>
                    <SetDuration incDuration={this.incPauseDurationHandler} decDuration={this.decPauseDurationHandler}
                                 label={'Pause duration'} time={this.state.duration.pause}/>
                    <SetDuration incDuration={this.incBreakDurationHandler} decDuration={this.decBreakDurationHandler}
                                 label={'Break duration'} time={this.state.duration.break}/>
                    <CommandButton start={this.startSession} reset={this.resetSession} pause={this.pauseSession}/>
                </div>
                <div className={classes.Timer}>
                    <CircularProgessBar duration={this.state.duration} session={this.state.session}/>
                </div>
            </div>
        );
    }


}


export default PomodoroTimer;