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
    return <div className = "newGame">
      <h1>{this.props.winner} wins!</h1>
      <h3>Click to below to start a new game</h3>
      <button onClick = {this.props.onClick} style = {{height: "40px", width: "100px",borderRadius: "8px", fontSize: "16px"}}>
        New Game
      </button>
    </div>
  }
}

export default class PlayPazzak extends Component {
  constructor(){
    super();
    this.pazzakDeck = fillDeck();
    this.startCard = this.pazzakDeck[Math.floor(Math.random()*10)];
    this.state = {playerPoints: this.startCard.pointValue, oppPoints: 0, playerName: "Player 1",
      oppName: "Nyssa", playerWins:0, oppWins:0, playerDefaultCards: [this.startCard],
      oppDefaultCards: [], playerDeck: fillPlayerHands(), oppDeck:fillPlayerHands(),
      playerIsStanding: false, oppIsStanding: false, gameOver : false};
    this.playersTurn = true;
    this.playerStands = false;
    this.opponentStands = false;
    this.roundOver = false;
    // this.gameOver = false;
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


  }

  componentDidUpdate(){
    if(!this.state.gameOver){
      if(!this.roundOver){
        if(!this.playersTurn){
          if(this.playerStands){
            if(this.state.oppIsStanding){
              this.determineWinner();
              this.firstTimeStand = false;
              console.log("one");
            }
            else if(this.firstTimeStand){
              this.firstTimeStand = false;
              this.opponentTurn();
            }
            else{              //not the first time through on a player stand
              if(this.state.oppPoints <= this.state.playerPoints){
                //If the player stands with a small amount of points, don't bother trying to play a card
                if(this.state.oppPoints < 14){
                  this.opponentTurn();
                }
                else if(this.state.oppPoints !== this.state.playerPoints){
                    let playCard = checkHand(this.state.oppDeck,this.state.oppPoints,this.state.playerIsStanding,this.state.playerPoints);
                      if(playCard !== -1 && !this.oppPlayedCard){
                        this.opponentPlayCard(playCard);
                        this.oppPlayedCard = true;
                      }
                      else{   //no good cards to play
                          this.opponentTurn();
                        }
                      }
                else{     //score are equal, determine a winner => tie
                  console.log("two");
                  this.determineWinner()
                  }
                }
              else {      //the player stands and the opp has more points
                  if(!this.state.oppIsStanding){        //either the user stood with fewer points and the opp wins or opp is over 20
                    if(this.state.oppPoints <= 20){
                      console.log("three");
                      this.determineWinner();
                    }
                    else{     //the opp is over 20 and should try and play a card
                      let playCard = checkHand(this.state.oppDeck,this.state.oppPoints,this.state.playerIsStanding,this.state.playerPoints);
                      if(playCard !== -1 && !this.oppPlayedCard){
                          this.opponentPlayCard(playCard);
                          this.oppPlayedCard = true;
                        }
                      else{       //opp is over 20 and can't play a card so determine winner => user
                        console.log("four");
                        this.determineWinner()
                      }
                    }
                  }
                }
              }
            }
          else{       //the player is not standing
            if(!this.state.oppIsStanding){
                //if the opponent score is between 17 and 20, check for card to get to better score and stand
                if(this.state.oppPoints >=17 && this.state.oppPoints <=20){
                  let playCard = checkHand(this.state.oppDeck,this.state.oppPoints,this.state.playerIsStanding,this.state.playerPoints);
                  //console.log(playCard);
                  if(playCard !== -1 && !this.oppPlayedCard){
                    this.opponentPlayCard(playCard);

                  }
                  else{     //can't play a card
                    this.opponentStands = true;
                    this.setState({oppIsStanding: true});
                    this.playersTurn = true;
                    this.playerTurn();
                  }
                }
                else{   //score is above 20 or below 17
                    let playCard = checkHand(this.state.oppDeck,this.state.oppPoints,this.state.playerIsStanding,this.state.playerPoints);
                    if(playCard !== -1 && !this.oppPlayedCard){
                      this.opponentPlayCard(playCard);
                    }
                    else{       //can't play a card
                      if(this.state.oppPoints > 20){        //over 20, determine winner => user
                        console.log("five");
                        this.determineWinner();
                      }
                      else{       //score is under 17, players Turn
                        this.playersTurn = true;
                        this.playerTurn();
                      }
                    }
                }
            }
          }
        }
      }
      else{     //the round is over
        if(this.state.oppWins === 3){
            this.whoWon = this.state.oppName
            console.log(this.whoWon)
            this.setState({gameOver: true});
          }
        else if (this.state.playerWins === 3){
            this.whoWon = this.state.playerName
            console.log(this.whoWon)
            this.setState({gameOver: true});
          }
        else{       //neither player has 3 points
          this.newRound();
        }
      }
    }
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
    // if(this.state.playerWins < 3 && this.state.oppWins < 3){
    //   this.newRound();
    // }
    // else{   //one of the players has 3 wins, end the game
    //   if(this.state.playerWins === 3){
    //     alert("You have won the match!");
    //   }
    //   else{       //opponent wins
    //     alert("Your opponent has won the match.")
    //   }
    // }

  }
  opponentTurn(){
    if(this.state.oppDefaultCards.length < 9 && !this.state.oppIsStanding){
      let random = Math.floor(Math.random()*10);
      //console.log(this.state.oppIsStanding);
        this.setState({oppDefaultCards: this.state.oppDefaultCards.concat(this.pazzakDeck[random]),
            oppPoints: this.state.oppPoints + this.pazzakDeck[random].pointValue});
      this.oppPlayedCard = false;
            //console.log(random);

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
    if(!this.playerStands){

        this.playersTurn = true;
        this.userPlayedCard = false;
        if(this.state.playerDefaultCards.length < 9){
          let random = Math.floor((Math.random() * 10));
          //console.log(random);
          this.setState({playerDefaultCards: this.state.playerDefaultCards.concat(this.pazzakDeck[random]),
            playerPoints: this.state.playerPoints + this.pazzakDeck[random].pointValue});
          }
        else{
          console.log("Out of space");
        }

    }
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
      this.setState({playerDeck: tempArray, playerDefaultCards: playArray,
         playerPoints: this.state.playerPoints + selectedCard.pointValue});
    }
    else{
      console.log("You already played a card!")
    }
  }
  stand(){
    if(this.playersTurn && !this.playerStands){
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
    this.setState({playerPoints: this.startCard.pointValue, oppPoints: 0, playerName: "Adam",
      oppName: "Nyssa", playerWins:0, oppWins:0, playerDefaultCards: [this.startCard],
      oppDefaultCards: [], playerDeck: fillPlayerHands(), oppDeck:fillPlayerHands(),
      playerIsStanding: false, oppIsStanding: false, gameOver : false});
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
