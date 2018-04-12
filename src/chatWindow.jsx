import React, { Component } from 'react';
import board from "./images/pazzakBoard2.png";
import "./pazzakGame.css";
import * as firebase from 'firebase'
import LogIn from './logIn.jsx';
import Loading from 'react-loading-animation';
import { Scrollbars } from 'react-custom-scrollbars';
import {HashRouter as Router, Route, Switch, Link, withRouter} from 'react-router-dom';

let bgDiv = {width: "100%", height: "100%", backgroundColor: "black", position: "fixed"};
let playingBoard = {height: "628px", width:"828px", marginLeft: "100px", backgroundImage: "url(" + board + ")"}


export default class Chat extends Component {
  constructor(){
    super();
    this.onEnter = this.onEnter.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }
  componentDidUpdate(){
    this.scrollToBottom();
  }
  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
}
  onEnter(e){
    let code = e.keyCode || e.which
    if(code === 13){
      console.log("submitting")
      e.preventDefault();
      e.stopPropagation();
      this.props.submit()
    }
  }
  render(){
    return(
          <div className = "chatWrapper">
            <div className = "chatHeader">Chat</div>
            <div className = "chatBody">
            {this.props.array.map((x,i)=>{
              if(x.username != ""){
                return(

                    <p key ={i}><b>{x.username}</b>: {x.message}</p>
                )
              }})}
              <div ref={(el) => { this.messagesEnd = el; }}></div>
              </div>

            <div className = "chatBox">
                <textarea onKeyPress = {this.onEnter} rows = "2" placeholder = "Enter Message Here" onChange = {this.props.onChange} value = {this.props.value}></textarea>
            </div>
          </div>

    )
  }
}
