import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from "react-router-dom";
import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';

import authReducer from './store/reducers/auth';
import teamReducer from './store/reducers/team';
import pomodoroReducer from './store/reducers/pomodoro';


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const appReducer = combineReducers({
        auth: authReducer,
        team: teamReducer,
        pomodoro:pomodoroReducer
    }
);
/*
const rootReducer = (state, action) => {
    console.log(action.type);
    if (action.type === actionTypes.AUTH_LOGOUT) {
        console.log("Drago");
       pomodoroReducer(undefined,action);
       //Moze se izkombinovati da sa root reducerom tako da mi pravimo switch i odlucimo na koji ide
       //ali u tom slucaju imamo dva switch-a :(
    }
    return appReducer(state, action)
};*/

const store = createStore(appReducer, composeEnhancers(applyMiddleware(thunk)));//devTool fror basic Redux

const app = (
    <Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
