import React, { Component } from 'react';
import {HashRouter as Router, Route, Switch, Link, withRouter} from 'react-router-dom';
import "./pazzakGame.css";
import * as firebase from "firebase";

export default class LogIn extends Component {
  constructor(){
    super();
  }
  componentWillMount(){
    
  }

  render(){
    return(
    <div className = "logIn">
      <h2>Please Log In</h2>
        <form onSubmit = {this.handleSubmit}>
          <p><input type="text" style = {{fontSize: "16px"}} value = {this.props.username}  placeholder="Username" onChange = {this.props.changeUser}/></p>
          <p><input type="password" style = {{fontSize: "16px"}} value = {this.props.password} placeholder="Password" onChange = {this.props.changePass}/></p>

          <p><button type="submit" style = {{width:"90px",
              height: "40px", position: "relative", display: "block", margin: "auto",
              borderRadius: "8px", background:"white", fontSize: "16px" }} onClick={this.props.handleLogin}>Log In</button></p>
        </form>
      <div>
        <p><font color = "white">Don't have an account? </font><Link to = "/createAccount">Click here to make one.</Link></p>
      </div>
    </div>
    )
  }
}
