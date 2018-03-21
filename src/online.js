import React, { Component } from 'react';
import board from "./images/pazzakBoard2.png";
import "./pazzakGame.css";
import gameCardOne from "./images/cards/1.png";
import gameCardTwo from "./images/cards/2.png";
import gameCardThree from "./images/cards/3.png";
import gameCardFour from "./images/cards/4.png";
import gameCardFive from "./images/cards/5.png";
import gameCardSix from "./images/cards/6.png";
import gameCardSeven from "./images/cards/7.png";
import gameCardEight from "./images/cards/8.png";
import gameCardNine from "./images/cards/9.png";
import gameCardTen from "./images/cards/10.png";
import plusOne from "./images/cards/plus_1.png"
import plusTwo from "./images/cards/plus_2.png"
import plusThree from "./images/cards/plus_3.png"
import plusFour from "./images/cards/plus_4.png"
import plusFive from "./images/cards/plus_5.png"
import plusSix from "./images/cards/plus_6.png"
import minusOne from "./images/cards/minus_1.png"
import minusTwo from "./images/cards/minus_2.png"
import minusThree from "./images/cards/minus_3.png"
import minusFour from "./images/cards/minus_4.png"
import minusFive from "./images/cards/minus_5.png"
import minusSix from "./images/cards/minus_6.png"
import blankCard from "./images/cards/blankCard.png"
import * as firebase from 'firebase'
import LogIn from './logIn.jsx';


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

//a simple function to fill the players hands with random +/-cards, will change later
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
  for(let i=0; i<=3; i++){
    returnedHand.push(Object.assign({},possibleCards[Math.floor(Math.random()*possibleCards.length)]));
  }
  return returnedHand;
    }

//a function to iterate over the opponents hand and return the index of a card to play
//based on a hierarchy of what the opponenent needs to do to win the game
const checkHand = (handArray, currentPoints, playerStands, playerPoints) => {
  let returnValue = -1;
  for(let i=0; i< 4; i++){
    //1st scenario: player stands, opp should play that gives them a higher score to win, but don't go over 20
    if(playerStands && handArray[i].pointValue + currentPoints > playerPoints && handArray[i].pointValue + currentPoints <= 20){
      returnValue = i;
    }
    //2nd scenario: player stands, opp can't win but can tie the player
    else if(playerStands && handArray[i].pointValue + currentPoints === playerPoints && handArray[i].pointValue + currentPoints <= 20){
      returnValue = i;
    }
    //3rd scenario: player is not standing, opp can play card to get to 20
    else if(!playerStands && handArray[i].pointValue + currentPoints === 20){
      returnValue = i;
    }
    //4th scenario: player is not stadning, opp can't get to 20 but can get to 19
    else if(!playerStands && handArray[i].pointValue + currentPoints === 19){
      returnValue = i;
    }
    //5th scenario: player is not standing, opp can't get to 19 or 20, but can get to 18
    else if(!playerStands && handArray[i].pointValue + currentPoints === 18){
      returnValue = i;
    }
    //6th scenario: player is not standing, opp can't get to 18,19,20 but can get to 17
    //might change this later, 17 is kind of low to stand on
    else if(!playerStands && handArray[i].pointValue + currentPoints === 17){
      returnValue = i;
    }
  }
  //if a card can be played, but your score is under 20 and the card will lower your score, dont play it
  if(returnValue !== -1 && currentPoints <=20 && currentPoints + handArray[returnValue].pointValue < currentPoints){
    return -1
  }
  else{
    return returnValue;
  }
}

export class Stands extends Component {
  render(){
    return <div style = {{color: "yellow", textShadow: "-2px 2px 1px4 #000000"}}><h1>STANDS</h1></div>
  }
}

export class NewGame extends Component {
  render(){
    return(
    <div className = "newGame">
      <h1>{this.props.winner} wins!</h1>
      <h3>Click to below to start a new game</h3>
      <button onClick = {this.props.onClick} style = {{height: "40px", width: "100px",borderRadius: "8px", fontSize: "16px"}}>
        New Game
      </button>
    </div>
  )}
}
export class Winner extends Component {
  render(){
    return(
      <div className = "winner"></div>
    )
  }
}

export class EnterName extends Component{
  render(){
    return <div className = "enterName">
      <form onSubmit = {this.props.submit}>
        <label style = {{textAlign: "center"}}><h1>Enter Your Name:
        <input type = "text" style = {{height: "30px", width: "300px",
          fontWeight: "bold", position: "relative", top: "-4px", fontSize: "16px"}}
          onChange = {this.props.onChange} value = {this.props.value}></input>
        </h1></label>
      <button type = 'button' style = {{width:"90px",
          height: "40px", position: "relative", display: "block", margin: "auto",
          borderRadius: "8px", background:"white", fontSize: "16px" }}
          onClick = {this.props.submit}>Submit</button>
      </form>
    </div>
  }
}

export default class Online extends Component {
  constructor(){
    super();
    this.pazzakDeck = fillDeck();
    this.startCard = this.pazzakDeck[Math.floor(Math.random()*10)];
    this.state = {playerPoints: this.startCard.pointValue, oppPoints: 0, playerName: "",
      oppName: "Darth Nihilus", playerWins:0, oppWins:0, playerDefaultCards: [this.startCard],
      oppDefaultCards: [], playerDeck: fillPlayerHands(), oppDeck:fillPlayerHands(),
      playerIsStanding: false, oppIsStanding: false, gameOver : false, gameBegin: false, loggedIn: false};
    this.playersTurn = true;
    this.playerStands = false;
    this.opponentStands = false;
    this.roundOver = false;
    this.userPlayedCard = false;
    this.whoWon = null;
    this.endTurn=this.endTurn.bind(this);
    this.playCard = this.playCard.bind(this);
    this.stand = this.stand.bind(this);
    this.playerTurn = this.playerTurn.bind(this);
    this.opponentPlayCard = this.opponentPlayCard.bind(this);
    this.determineWinner = this.determineWinner.bind(this);
    this.newRound = this.newRound.bind(this);
    this.newGame = this.newGame.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.app = firebase.database().ref('PlayerLobby');


  }

  componentDidUpdate(){
  }

  determineWinner(){
    let winner = null
    this.roundOver = true;
    //if the user is over 20 and the opp is under, opp wins
    if(this.state.playerPoints > 20 && this.state.oppPoints <= 20){
      winner = "Opponent";
    }
    //if the user is under 20 and the opp goes over, player wins
    else if(this.state.playerPoints <= 20 && this.state.oppPoints > 20){
      winner = "Player";
    }
    else if(this.state.playerPoints > this.state.oppPoints){
      winner = "Player";
    }
    else if(this.state.playerPoints < this.state.oppPoints){
      winner = "Opponent";
    }
    else{
      winner = "Tie";
    }
    setTimeout(()=>{
      if(winner === "Player"){
        alert("You win the round.")
        this.setState({playerWins: this.state.playerWins + 1});
      }
      else if(winner === "Opponent"){
        alert("Your opponent has won the round.")
        this.setState({oppWins: this.state.oppWins + 1});
      }
      else{
        alert("Tie game.")
        this.newRound();
      }
    },500);
  }
  opponentTurn(){
    if(this.state.oppDefaultCards.length < 9 && !this.state.oppIsStanding){
      setTimeout(()=>{
        let random = Math.floor(Math.random()*10);
        //console.log(this.state.oppIsStanding);
          this.setState({oppDefaultCards: this.state.oppDefaultCards.concat(this.pazzakDeck[random]),
              oppPoints: this.state.oppPoints + this.pazzakDeck[random].pointValue});
        this.oppPlayedCard = false;
              //console.log(random);

      },500);
    }
    else if(this.opponentStands){
      this.playerTurn();      //if opponent stands go directly back to player Turn
    }
  }
  opponentPlayCard(index){

      let tempArray = this.state.oppDeck.slice();
      let playThisCard = Object.assign({}, tempArray[index]);
      //change the values to remove the card's image and point value
      tempArray[index].pointValue = "";
      tempArray[index].image = null;
      //console.log(playThisCard.pointValue);
      this.oppPlayedCard = true;
      this.setState({oppDefaultCards: this.state.oppDefaultCards.concat(playThisCard),
        oppPoints: this.state.oppPoints + playThisCard.pointValue,
        oppDeck: tempArray});


  }

  playerTurn(){
    setTimeout(()=>{
      if(!this.playerStands){
          this.playersTurn = true;
          this.userPlayedCard = false;
          if(this.state.playerDefaultCards.length < 9){
            let random = Math.floor((Math.random() * 10));
            //console.log(random);
            if(this.state.playerPoints + this.pazzakDeck[random].pointValue === 20){
              this.firstTimeStand = true;
              this.playersTurn = false;
              this.playerStands = true;
              this.setState({playerDefaultCards: this.state.playerDefaultCards.concat(this.pazzakDeck[random]),
                playerPoints: this.state.playerPoints + this.pazzakDeck[random].pointValue, playerIsStanding: true});
            }
            else{
              this.setState({playerDefaultCards: this.state.playerDefaultCards.concat(this.pazzakDeck[random]),
                playerPoints: this.state.playerPoints + this.pazzakDeck[random].pointValue});
            }
          }
          else{
            console.log("Out of space");
          }
        }
      },500);
    }

  endTurn(){
    if(this.playersTurn && !this.playerStands){
      if(this.state.playerPoints > 20){
        this.determineWinner();
      }
      else{
        this.playersTurn = false;
        this.opponentTurn();
      }
    }

    else{
      console.log("not your turn");
    }
  }
  playCard(event){
    if(!this.userPlayedCard && !this.playerStands){             //if the users hasn't already played a card
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
      if(this.state.playerPoints + selectedCard.pointValue === 20){
        this.firstTimeStand = true;
        this.playersTurn = false;
        this.playerStands = true;
        this.setState({playerDeck: tempArray, playerDefaultCards: playArray,
          playerPoints: this.state.playerPoints + selectedCard.pointValue, playerIsStanding: true});
        }
      else{
        this.setState({playerDeck: tempArray, playerDefaultCards: playArray,
          playerPoints: this.state.playerPoints + selectedCard.pointValue});
      }
    }

    else{
      console.log("You already played a card!")
    }
  }
  stand(){
    if(this.playersTurn && !this.state.playerIsStanding){
      if(this.state.playerPoints > 20){
        this.determineWinner();
      }
      else {
        //playerStands true blocks all other user plays

        this.firstTimeStand = true;
        this.playersTurn = false;
        this.playerStands = true;
        this.setState({playerIsStanding: true});
      }

    }
    else{
      console.log("You have decided to stand. You can no longer make moves");
    }
  }
  newRound(){
    //reset the cards and player hands, reset booleans
    this.startCard = this.pazzakDeck[Math.floor(Math.random()*10)];
    this.playersTurn = true;
    this.playerStands = false;
    this.opponentStands = false;
    this.roundOver = false;
    this.userPlayedCard = false;
    this.setState({playerPoints: this.startCard.pointValue, oppPoints: 0,
      playerDefaultCards: [this.startCard], oppDefaultCards: [],
      playerIsStanding: false, oppIsStanding: false});
  }
  newGame(){
    this.startCard = this.pazzakDeck[Math.floor(Math.random()*10)];
    this.setState({playerPoints: this.startCard.pointValue, oppPoints: 0,
      playerWins:0, oppWins:0, playerDefaultCards: [this.startCard],
      oppDefaultCards: [], playerDeck: fillPlayerHands(), oppDeck:fillPlayerHands(),
      playerIsStanding: false, oppIsStanding: false, gameOver : false});
  }

  handleSubmit(event){
    console.log(this.state.playerName);
    this.app.push({"username":this.state.playerName});
    if(this.state.playerName.length === 0){
      this.setState({gameBegin: true, playerName: "Player 1"});
    }
    else{
      this.setState({gameBegin: true})
    }
  }
  handleChange(event){
    this.setState({playerName: event.target.value});
  }

  render(){
    if(!this.state.loggedIn){
      return(
        <div style ={bgDiv}>
          <div style = {playingBoard}>
          <LogIn/>
        </div>
      </div>
      )
    }
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
                <td className = "tableData">{this.state.oppDeck[0].image !== null && <img src = {blankCard} alt=""/>}</td>
                <td className = "tableData">{this.state.oppDeck[1].image !== null && <img src = {blankCard} alt=""/>}</td>
                <td className = "tableData">{this.state.oppDeck[2].image !== null && <img src = {blankCard} alt=""/>}</td>
                <td className = "tableData">{this.state.oppDeck[3].image !== null && <img src = {blankCard} alt=""/>}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className = "controlPanel">
          <button type = "button" style = {{height: "40px", width: "100px",
            borderRadius: "8px", fontSize: "16px", marginLeft: "10px", float: "right"}} onClick = {this.endTurn}>
            End Turn
          </button>
          <button type = "button" style = {{height: "40px", width: "100px",
            borderRadius: "8px", fontSize: "16px", marginLeft: "10px", float: "left"}} onClick = {this.stand}>
            Stand
          </button>
        </div>
        <div className = "standIndicator">
          <div style = {{float: "left", width: "47%", height: "100%", textAlign: "center"}}>
            {this.state.playerIsStanding && <Stands/>}
          </div>
          <div style = {{float: "right", width: "47%", height: "100%", textAlign: "center"}}>
            {this.state.oppIsStanding && <Stands/>}
          </div>
        </div>
        <div>{this.state.gameOver && <NewGame winner = {this.whoWon} onClick = {this.newGame}/>}</div>
        </div>
      </div>
    )
  }
}
