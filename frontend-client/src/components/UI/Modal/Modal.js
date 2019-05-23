import React, {Component, Fragment} from 'react';
import Backdrop from '../Backdrop/Backdrop';
import classes from './Modal.module.scss';


class Modal extends Component {
    render() {
        return (
            <Fragment>
                <Backdrop show={this.props.show}/>
                <div className={classes.Modal}
                    style={{
                        transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
                        opacity: this.props.show ? '1' : '0'
                    }}>
                    {this.props.children}
                </div>
            </Fragment>
        );
    }
}

export default Modal;