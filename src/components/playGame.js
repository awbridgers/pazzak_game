import React, { Component } from 'react';
import board from "../images/pazzakBoard.png";


const boardStyle = {



}

export default class PlayPazzak extends Component {
  render(){
    return(
      <div style = {{width: "100%", height: "100%", backgroundColor: "black", textAlign: "center"}}>
        <div style = {{boardStyle}}><img src = {board}></img></div>
      </div>
    )
  }
}
