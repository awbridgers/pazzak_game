import React, { Component } from 'react';
import board from "../images/pazzakBoard2.png";
import "../pazzakGame.css";

import gameCardOne from "../images/cards/1.png";
import gameCardTwo from "../images/cards/2.png";
import gameCardThree from "../images/cards/3.png";
import gameCardFour from "../images/cards/4.png";
import gameCardFive from "../images/cards/5.png";
import gameCardSix from "../images/cards/6.png";
import gameCardSeven from "../images/cards/7.png";
import gameCardEight from "../images/cards/8.png";
import gameCardNine from "../images/cards/9.png";
import gameCardTen from "../images/cards/10.png";


let bgDiv = {width: "100%", height: "100%", backgroundColor: "black", textAlign: "center", position: "fixed"};
let playingBoard = {height: "628px", width:"828px", margin: "auto", backgroundImage: "url(" + board + ")"}

class gameCards {
  constructor (points, picture){
    this.pointValue = points;
    this.image = picture;
  }
}

const fillDeck = deckArray => {

}


export default class PlayPazzak extends Component {
  constructor(){
    super();
    this.cardOne = new gameCards(1, gameCardOne);

  }
  render(){
    return(
      <div style = {bgDiv}>
        <div style = {playingBoard}>
          <table className = "playerCards">
            <tbody>
              <tr className = "tableRow">
                <td className = "tableData"><img src = {this.cardOne.image}  alt = "" /></td>
                <td className = "tableData"><img src = {this.cardOne.image} alt = ""/></td>
                <td className = "tableData"><img src = {this.cardOne.image} alt = ""/></td>
              </tr>
              <tr className = "tableRow">
                <td className = "tableData"><img src = {this.cardOne.image} alt = ""/></td>
                <td className = "tableData"><img src = {this.cardOne.image} alt = ""/></td>
                <td className = "tableData"><img src = {this.cardOne.image} alt = ""/></td>
              </tr>
              <tr className = "tableRow">
                <td className = "tableData"><img src = {this.cardOne.image} alt = ""/></td>
                <td className = "tableData"><img src = {this.cardOne.image} alt = ""/></td>
                <td className = "tableData"><img src = {this.cardOne.image} alt = ""/></td>
              </tr>
            </tbody>
          </table>
          <table className = "opponentCards">
            <tbody>
              <tr className = "tableRow">
                <td className = "tableData"><img src = {this.cardOne.image} alt = ""/></td>
                <td className = "tableData"><img src = {this.cardOne.image} alt = ""/></td>
                <td className = "tableData"><img src = {this.cardOne.image} alt = ""/></td>
              </tr>
              <tr className = "tableRow">
                <td className = "tableData"><img src = {this.cardOne.image} alt = ""/></td>
                <td className = "tableData"><img src = {this.cardOne.image} alt = ""/></td>
                <td className = "tableData"><img src = {this.cardOne.image} alt = ""/></td>
              </tr>
              <tr className = "tableRow">
                <td className = "tableData"><img src = {this.cardOne.image} alt = ""/></td>
                <td className = "tableData"><img src = {this.cardOne.image} alt = ""/></td>
                <td className = "tableData"><img src = {this.cardOne.image} alt = ""/></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
