import React, { Component } from 'react';
import board from "../images/pazzakBoard2.png";


let bgDiv = {width: "100%", height: "100%", backgroundColor: "black", textAlign: "center", position: "fixed"};
let playingBoard = {height: "628px", width:"828px", margin: "auto"}




export default class PlayPazzak extends Component {
  render(){
    return(
      <div style = {bgDiv}>
        <div style = {playingBoard}>
          <img src = {board}></img>
        </div>
      </div>
    )
  }
}
