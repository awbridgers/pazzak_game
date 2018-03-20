import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import PlayPazzak from "./play.js";
import Online from "./online.js";
import config from './config.js';
import * as firebase from "firebase";

firebase.initializeApp(config);


const Test = () => <h1>This is a test</h1>

ReactDOM.render(<Online />, document.getElementById('root'));
registerServiceWorker();
