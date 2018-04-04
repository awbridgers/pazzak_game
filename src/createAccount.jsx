import React, { Component } from 'react';
import board from "./images/pazzakBoard2.png";
import "./pazzakGame.css";
import * as firebase from 'firebase'
import LogIn from './logIn.jsx';
import Loading from 'react-loading-animation';
import { Scrollbars } from 'react-custom-scrollbars';
import {HashRouter as Router, Route, Switch, Link, withRouter} from 'react-router-dom';

let bgDiv = {width: "100%", height: "100%", backgroundColor: "black", position: "fixed"};
let playingBoard = {height: "628px", width:"828px", margin: "auto", backgroundImage: "url(" + board + ")"}

class CreateAccount extends Component {
  constructor(){
    super();
    this.state = {username: "", password: "", confirmPassword:""}
    this.updateUser = this.updateUser.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.updateConfirmPassword = this.updateConfirmPassword.bind(this);
    this.submit = this.submit.bind(this);
  }
  updateUser(e){
    this.setState({username: e.target.value});
  }
  updatePassword(e){
    this.setState({password: e.target.value});
  }
  updateConfirmPassword(e){
    this.setState({confirmPassword: e.target.value})
  }
  submit(event){
    //create the account
    event.preventDefault();
    event.stopPropagation();
    if(this.state.password === this.state.confirmPassword && this.state.username.length >= 4){
      firebase.auth().createUserWithEmailAndPassword(this.state.username + "@pazzak.com", this.state.password)
      .then(()=>{
        firebase.auth().currentUser.updateProfile({displayName: this.state.username}).then(()=>{
          //console.log(firebase.auth().currentUser)
          alert("Creation successful");
          this.props.history.push("/playOnline")})}).catch(function(error) {
          // Handle Errors here.
          let errorCode = error.code;
          let errorMessage = error.message;
          let newError = errorMessage.replace("email address", "username");
          alert(newError);

        });
      }
    else if(this.state.password != this.state.confirmPassword){
      alert("Passwords do not match")
    }
    else if(this.state.username.length < 4){
      alert("Username must be atleast 4 characters")
    }
  }
  render(){
    return(
      <div style = {bgDiv}>
        <div style = {playingBoard}>
          <div className = "createAccount">
            <h3>Create Account</h3>
            <form onSubmit ={this.submit}>
              <p><label>Username</label>
              <input type = "text" placeholder = "Username" value = {this.state.username}
                onChange = {this.updateUser}></input></p>
              <p><label>Password</label>
              <input type = "password" placeholder = "Password" value = {this.state.password}
                onChange = {this.updatePassword}></input></p>
              <p><label>Confirm Password</label>
              <input type = "password" placeholder = "Confirm Password" value = {this.state.confirmPassword}
                onChange = {this.updateConfirmPassword}></input></p>
              <button type = 'submit'>Create</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}
export default withRouter(CreateAccount);
