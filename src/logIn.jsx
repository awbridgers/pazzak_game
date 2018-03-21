import React, { Component } from 'react';
import "./pazzakGame.css"

export default class LogIn extends Component {
  constructor(){
    super();
  }

  render(){
    return(
    <div className = "logIn">
      <h2>Please Log In</h2>
        <form onSubmit = {this.handleSubmit}>
          <p><input type="text" style = {{fontSize: "16px"}} value = {this.props.username}  placeholder="Username or Email" onChange = {this.props.changeUser}/></p>
          <p><input type="password" style = {{fontSize: "16px"}} value = {this.props.password} placeholder="Password" onChange = {this.props.changePass}/></p>

          <p><button type="submit" style = {{width:"90px",
              height: "40px", position: "relative", display: "block", margin: "auto",
              borderRadius: "8px", background:"white", fontSize: "16px" }} onClick={this.props.handleLogin}>Log In</button></p>
        </form>
      <div>
        <p><font color = "white">Don't have an account? </font>Click here to make one.</p>
      </div>
    </div>
    )
  }
}
