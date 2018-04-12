import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import PlayPazzak from "./play.js";
import Online from "./online.js";
import config from './config.js';
import CreateAccount from "./createAccount.jsx";
import Chat from "./chatWindow.jsx"
import "./pazzakGame.css";
import {HashRouter as Router, Route, Switch, Link, withRouter} from 'react-router-dom';
import * as firebase from "firebase";
import board from "./images/pazzakBoard2.png";
let bgDiv = {width: "100%", height: "100%", backgroundColor: "black", position: "fixed"};
let playingBoard = {height: "628px", width:"828px", margin: "auto", backgroundImage: "url(" + board + ")"}

firebase.initializeApp(config);


const Homepage = withRouter (({history}) => (
  <div style ={bgDiv}>
    <div style = {playingBoard}>
      <div className = "enterName">
        <h1>Welcome to Pazzak!</h1>
        <h3>How would you like to play?</h3>
        <div style = {{float: "left", height:"250px", width: "50%" }}>
          <button type = 'button' style = {{width:"150px",
              height: "75px", position: "relative", margin: "auto",
              borderRadius: "8px", background:"white", fontSize: "16px",left:"25px", top:"20px"}}
              onClick = {() => {history.push("/playOnline")}}>Play Online</button>
        </div>
        <div style = {{float:"right", height:"250px", width: "50%" }}>
          <button type = 'button' style = {{width:"150px",
              height: "75px", position: "relative", margin: "auto",
              borderRadius: "8px", background:"white", fontSize: "16px", right: "25px", top: "20px"}}
              onClick = {()=>{history.push("/playComputer")}}>Play vs Computer</button>
        </div>
      </div>
    </div>
  </div>
))



const Routing = () => (
  <Router>
    <div>
    <Route exact path ="/" component = {Homepage} />
    <Route path = "/playOnline" component = {Online} />
    <Route path = "/playComputer" component = {PlayPazzak} />
    <Route path = "/createAccount" component = {CreateAccount} />

    </div>
  </Router>
)

ReactDOM.render(<Routing />, document.getElementById('root'));
registerServiceWorker();
