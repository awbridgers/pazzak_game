import React, { Component } from 'react';
import "./pazzakGame.css"

export default class LogIn extends Component {
  constructor(){
    super();
    this.state = {password: "", userName:""}
    this.changePass = this.changePass.bind(this);
    this.changeUser = this.changeUser.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  changeUser(e){
    this.setState({userName:e.target.value});
  }
  changePass(e){
    this.setState({password:e.target.value});
  }
  handleSubmit(e){
    e.preventDefault()
    e.stopPropagation();
    console.log(this.state.userName, this.state.password);
  }
  render(){
    return(
    <div className = "logIn">
      <h2>Please Log In</h2>
        <form onSubmit = {this.handleSubmit}>
          <p><input type="text" style = {{fontSize: "16px"}} value = {this.state.username}  placeholder="Username or Email" onChange = {this.changeUser}/></p>
          <p><input type="password" style = {{fontSize: "16px"}} value = {this.state.password} placeholder="Password" onChange = {this.changePass}/></p>

          <p><button type="submit" onClick={this.handleSubmit}>Log In</button></p>
        </form>
      <div>
        <p><font color = "white">Don't have an account? </font>Click here to make one.</p>
      </div>
    </div>
    )
  }
}
