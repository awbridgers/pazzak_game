import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import PlayPazzak from "./play.js"


const Test = () => <h1>This is a test</h1>

ReactDOM.render(<PlayPazzak />, document.getElementById('root'));
registerServiceWorker();
