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
import plusOne from "../images/cards/plus_1.png"
import plusTwo from "../images/cards/plus_2.png"
import plusThree from "../images/cards/plus_3.png"
import plusFour from "../images/cards/plus_4.png"
import plusFive from "../images/cards/plus_5.png"
import plusSix from "../images/cards/plus_6.png"
import minusOne from "../images/cards/minus_1.png"
import minusTwo from "../images/cards/minus_2.png"
import minusThree from "../images/cards/minus_3.png"
import minusFour from "../images/cards/minus_4.png"
import minusFive from "../images/cards/minus_5.png"
import minusSix from "../images/cards/minus_6.png"


let bgDiv = {width: "100%", height: "100%", backgroundColor: "black", position: "fixed"};
let playingBoard = {height: "628px", width:"828px", margin: "auto", backgroundImage: "url(" + board + ")"}

class gameCards {
  constructor (points, picture){
    this.pointValue = points;
    this.image = picture;
  }
}

//a simple method to populate the deckArray
const fillDeck = () => {
  let deckArray = [];
  deckArray.push(new gameCards(1, gameCardOne));
  deckArray.push(new gameCards(2, gameCardTwo));
  deckArray.push(new gameCards(3, gameCardThree));
  deckArray.push(new gameCards(4, gameCardFour));
  deckArray.push(new gameCards(5, gameCardFive));
  deckArray.push(new gameCards(6, gameCardSix));
  deckArray.push(new gameCards(7, gameCardSeven));
  deckArray.push(new gameCards(8, gameCardEight));
  deckArray.push(new gameCards(9, gameCardNine));
  deckArray.push(new gameCards(10, gameCardTen));
  return deckArray;
}

const fillPlayerHands = () => {
  let possibleCards = [];
  let returnedHand =[];
  possibleCards.push(new gameCards(1, plusOne));
  possibleCards.push(new gameCards(2, plusTwo));
  possibleCards.push(new gameCards(3, plusThree));
  possibleCards.push(new gameCards(4, plusFour));
  possibleCards.push(new gameCards(5, plusFive));
  possibleCards.push(new gameCards(6, plusSix));
  possibleCards.push(new gameCards(-1, minusOne));
  possibleCards.push(new gameCards(-2, minusTwo));
  possibleCards.push(new gameCards(-3, minusThree));
  possibleCards.push(new gameCards(-4, minusFour));
  possibleCards.push(new gameCards(-5, minusFive));
  possibleCards.push(new gameCards(-6, minusSix));
  for(let i=0; i<4; i++){
    returnedHand.push(possibleCards[Math.floor(Math.random()*possibleCards.length)]);
  }
  return returnedHand;
    }

export default class PlayPazzak extends Component {
  constructor(){
    super();
    this.cardOne = new gameCards(1, gameCardOne);
    this.pazzakDeck = fillDeck();
    this.startCard = this.pazzakDeck[Math.floor(Math.random()*10)];
    this.state = {playerPoints: this.startCard.pointValue, oppPoints: 0, playerName: "Adam",
      oppName: "Nyssa", playerWins:0, oppWins:0, playerDefaultCards: [this.startCard],
      oppDefaultCards: [], playerDeck: fillPlayerHands(), oppDeck:fillPlayerHands()};
    this.playersTurn = true;
    this.playerStands = false;
    this.userPlayedCard = false;
    this.endTurn=this.endTurn.bind(this);
    this.playCard = this.playCard.bind(this);


  }

  opponentTurn(){
    if(this.state.oppDefaultCards.length < 9){
      let random = Math.floor(Math.random()*10);
      this.setState({oppDefaultCards: this.state.oppDefaultCards.concat(this.pazzakDeck[random]),
      oppPoints: this.state.oppPoints + this.pazzakDeck[random].pointValue});
    }
  }
  endTurn(){
    if(this.playersTurn === true){
      this.playersTurn = false;
      this.opponentTurn();
      if(this.state.playerDefaultCards.length < 9){
        setTimeout(()=> {
          let random = Math.floor((Math.random() * 10));
          console.log(random);
          this.setState({playerDefaultCards: this.state.playerDefaultCards.concat(this.pazzakDeck[random]),
            playerPoints: this.state.playerPoints + this.pazzakDeck[random].pointValue});
          this.playersTurn = true;
          this.userPlayedCard = false;              //once a player ends turn they can play another card
          //console.log(this.playersTurn)
        },2000);
      }

    else{
      console.log("Out of space");
    }
  }
  else{
    console.log("not your turn");
  }


  }
  playCard(event){
    if(!this.userPlayedCard){             //if the users hasn't already played a card
      //set this.userPlayedCard to true so they can't play another card
      this.userPlayedCard = true;
      //make copy of state arrays
      const tempArray = this.state.playerDeck.slice();
      const playArray = this.state.playerDefaultCards.slice();
      //make a copy of the selected card object
      const selectedCard = Object.assign({}, tempArray[event.target.id]);
      //console.log(selectedCard.pointValue)
      //push the new card onto the playing area
      playArray.push(selectedCard);
      //remove the img src from the player's deck
      tempArray[event.target.id].image="";
      //set the state
      this.setState({playerDeck: tempArray, playerDefaultCards: playArray,
         playerPoints: this.state.playerPoints + selectedCard.pointValue});
    }
    else{
      console.log("You already played a card!")
    }
  }
  render(){
    return(
      <div style = {bgDiv}>
        <div style = {playingBoard}>
          <div className = "points">
            <div className = "playerPoints">{this.state.playerPoints}</div>
            <div className = "oppPoints">{this.state.oppPoints}</div>
          </div>
          <div className = "names">
            <div className = "playerName">{this.state.playerName}</div>
            <div className = "oppName">{this.state.oppName}</div>
          </div>
        <div className = "score">
          <div className = "playerScore">{this.state.playerWins}</div>
          <div className = "oppScore">{this.state.oppWins}</div>
        </div>
        <div className = "playingArea">
          <table className = "playerCards">
            <tbody>
              <tr className = "tableRow">
                <td className = "tableData">{this.state.playerDefaultCards[0] !== undefined && <img src = {this.state.playerDefaultCards[0].image}  alt = "" />}</td>
                <td className = "tableData">{this.state.playerDefaultCards[1] !== undefined && <img src = {this.state.playerDefaultCards[1].image} alt = ""/>}</td>
                <td className = "tableData">{this.state.playerDefaultCards[2] !== undefined && <img src = {this.state.playerDefaultCards[2].image} alt = ""/>}</td>
              </tr>
              <tr className = "tableRow">
                <td className = "tableData">{this.state.playerDefaultCards[3] !== undefined && <img src = {this.state.playerDefaultCards[3].image} alt = ""/>}</td>
                <td className = "tableData">{this.state.playerDefaultCards[4] !== undefined && <img src = {this.state.playerDefaultCards[4].image} alt = ""/>}</td>
                <td className = "tableData">{this.state.playerDefaultCards[5] !== undefined && <img src = {this.state.playerDefaultCards[5].image} alt = ""/>}</td>
              </tr>
              <tr className = "tableRow">
                <td className = "tableData">{this.state.playerDefaultCards[6] !== undefined && <img src = {this.state.playerDefaultCards[6].image} alt = ""/>}</td>
                <td className = "tableData">{this.state.playerDefaultCards[7] !== undefined && <img src = {this.state.playerDefaultCards[7].image} alt = ""/>}</td>
                <td className = "tableData">{this.state.playerDefaultCards[8] !== undefined && <img src = {this.state.playerDefaultCards[8].image} alt = ""/>}</td>
              </tr>
            </tbody>
          </table>
          <table className = "opponentCards">
            <tbody>
              <tr className = "tableRow">
                <td className = "tableData">{this.state.oppDefaultCards[0] !== undefined && <img src = {this.state.oppDefaultCards[0].image} alt = ""/>}</td>
                <td className = "tableData">{this.state.oppDefaultCards[1] !== undefined && <img src = {this.state.oppDefaultCards[1].image} alt = ""/>}</td>
                <td className = "tableData">{this.state.oppDefaultCards[2] !== undefined && <img src = {this.state.oppDefaultCards[2].image} alt = ""/>}</td>
              </tr>
              <tr className = "tableRow">
                <td className = "tableData">{this.state.oppDefaultCards[3] !== undefined && <img src = {this.state.oppDefaultCards[3].image} alt = ""/>}</td>
                <td className = "tableData">{this.state.oppDefaultCards[4] !== undefined && <img src = {this.state.oppDefaultCards[4].image} alt = ""/>}</td>
                <td className = "tableData">{this.state.oppDefaultCards[5] !== undefined && <img src = {this.state.oppDefaultCards[5].image} alt = ""/>}</td>
              </tr>
              <tr className = "tableRow">
                <td className = "tableData">{this.state.oppDefaultCards[6] !== undefined && <img src = {this.state.oppDefaultCards[6].image} alt = ""/>}</td>
                <td className = "tableData">{this.state.oppDefaultCards[7] !== undefined && <img src = {this.state.oppDefaultCards[7].image} alt = ""/>}</td>
                <td className = "tableData">{this.state.oppDefaultCards[8] !== undefined && <img src = {this.state.oppDefaultCards[8].image} alt = ""/>}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className = "hands">
          <table className = "playerHand">
            <tbody>
              <tr>
                <td className = "tableData"><img src = {this.state.playerDeck[0].image} id ="0" alt=""  onClick = {this.playCard}/></td>
                <td className = "tableData"><img src = {this.state.playerDeck[1].image} id = "1" alt="" onClick = {this.playCard}/></td>
                <td className = "tableData"><img src = {this.state.playerDeck[2].image} id = "2" alt="" onClick = {this.playCard}/></td>
                <td className = "tableData"><img src = {this.state.playerDeck[3].image} id = "3" alt="" onClick = {this.playCard}/></td>
              </tr>
            </tbody>
          </table>
          <table className = 'oppHand'>
            <tbody>
              <tr>
                <td className = "tableData"><img src = {this.state.oppDeck[0].image} alt=""/></td>
                <td className = "tableData"><img src = {this.state.oppDeck[1].image} alt=""/></td>
                <td className = "tableData"><img src = {this.state.oppDeck[2].image} alt=""/></td>
                <td className = "tableData"><img src = {this.state.oppDeck[3].image} alt=""/></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className = "controlPanel">
          <button type = "button" style = {{height: "40px", width: "100px",
            borderRadius: "8px", fontSize: "16px", marginLeft: "10px", float: "right"}} onClick = {this.endTurn}>
            End Turn
          </button>
        </div>
        </div>
      </div>
    )
  }
}
