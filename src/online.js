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
import Loading from 'react-loading-animation';
import { Scrollbars } from 'react-custom-scrollbars';


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

export class SearchGames extends Component{
  render(){
    return <div className = "enterName">
      <div style = {{float: "left", height:"250px", width: "50%" }}>
      <button type = 'button' style = {{width:"150px",
          height: "75px", position: "relative", margin: "auto",
          borderRadius: "8px", background:"white", fontSize: "16px",left:"25px", top: "87px"}}
          onClick = {this.props.submit}>Create a Game</button>
        </div>
        <div style = {{float:"right", height:"250px", width: "50%" }}>
          <button type = 'button' style = {{width:"150px",
              height: "75px", position: "relative", margin: "auto",
              borderRadius: "8px", background:"white", fontSize: "16px", right: "25px", top: "87px"}}
              onClick = {this.props.findGames}>Search For Games</button></div>
    </div>
  }
}

export default class Online extends Component {
  constructor(){
    super();
    this.pazzakDeck = fillDeck();
    this.startCard = this.pazzakDeck[Math.floor(Math.random()*10)];
    this.state = {playerPoints: this.startCard.pointValue, oppPoints: 0, playerName: "",
      oppName: "", playerWins:0, oppWins:0, playerDefaultCards: [this.startCard],
      oppDefaultCards: [], playerDeck: fillPlayerHands(), oppDeck:fillPlayerHands(),
      playerIsStanding: false, oppIsStanding: false, gameOver : false, searchBegin: false, loggedIn: false,
      username: "username", password:"password", gameJoined: false, gameList:[], createdGame: false,gameKey: null,
      role: null, loading: false};
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
    this.createGame = this.createGame.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.changeUser = this.changeUser.bind(this);
    this.changePass = this.changePass.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.logOut = this.logOut.bind(this);
    this.findGames = this.findGames.bind(this);
    this.joinGame = this.joinGame.bind(this);
    this.cancelGame = this.cancelGame.bind(this);
    this.gamesList = firebase.database().ref('gamesList');
    this.gameLocation = null;


  }

  componentDidUpdate(){
    if(this.state.gameJoined){
      this.creator = this.gamesList.child(this.state.gameKey + "/creator");
      this.joiner = this.gamesList.child(this.state.gameKey + "/joiner");
      this.joiner.once('value').then((snapshot)=>console.log(snapshot.val()));


      if(this.state.role === 'creator' && this.state.oppName === ""){
        this.createdGameRef.off();
        this.joiner.once('value').then((snapshot)=>{
          console.log(snapshot.val())
          let opponentsUsername = snapshot.val().username;
          this.setState({oppName: opponentsUsername});
        });
      }
      if(this.state.role === 'joiner' && this.state.oppName === ""){
        this.creator.once('value').then((snapshot)=>{
          console.log(snapshot.val())
          let opponentsUsername = snapshot.val().username;
          this.setState({oppName: opponentsUsername});
        });
      }


    }
    if(this.state.createdGame && !this.state.gameJoined){
      this.createdGameRef = this.gamesList.child(this.state.gameKey);
      this.createdGameRef.on('value',(snapshot)=>{
        if(snapshot.val().state === 'joined'){
          this.setState({gameJoined: true});
        }
      })
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

  createGame(event){
    let newRef = this.gamesList.push()
    let createdGameKey = newRef.key;
    let newGame = {
      "creator": {uid:firebase.auth().currentUser.uid, username: this.state.username,
    gameInfo: {stands: false, playedCard: false, playerCardsRemaining: 4, playerCardUsed: 0, gameCardPlayed: 0}},
      "state": "open"
    }
    newRef.set(newGame);
    this.setState({createdGame: true, gameKey: createdGameKey, role: 'creator'});
  }
  handleChange(event){
    this.setState({playerName: event.target.value});
  }
  changeUser(e){
    this.setState({username:e.target.value});
  }
  changePass(e){
    this.setState({password:e.target.value});
  }
  handleLogin(e){
    e.preventDefault()
    e.stopPropagation();
    console.log(this.state.username, this.state.password);
    firebase.auth().signInWithEmailAndPassword(this.state.username + "@pazzak.com", this.state.password).then(()=>{
      console.log("Signed In!");
      this.setState({loggedIn:true});
    }
    ).catch((error)=>{
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert(errorMessage);
      }
    });
  }
  logOut(){
    firebase.auth().signOut().then(()=>this.setState({username: "", password: "", loggedIn:false,
      playerPoints: this.startCard.pointValue, oppPoints: 0,
        playerWins:0, oppWins:0, playerDefaultCards: [this.startCard],
        oppDefaultCards: [], playerDeck: fillPlayerHands(), oppDeck:fillPlayerHands(),
        playerIsStanding: false, oppIsStanding: false, gameOver : false}))
  }
  findGames(){
    this.gamesList.once("value").then((snapshot)=>{
      let currentGames = [];
      snapshot.forEach((childSnapshot)=>{
        let game = {gameID:childSnapshot.key, game: childSnapshot.val()}
        currentGames.push(game);
        //console.log(game)
      })
      this.setState({gameList: currentGames, searchBegin: true})
    })
  }
  joinGame(e){
    let gameKey = e.target.value;
    console.log(gameKey)
    this.gameLocation = this.gamesList.child(gameKey);
    this.gameLocation.transaction((game)=>{
      if(!game){
        return game
      }
      if(game){
        if(!game.joiner){
          game.joiner = {uid: firebase.auth().currentUser.uid, username: this.state.username};
          game.state = "joined";
        }
        return game;
      }
    })
    this.setState({role: 'joiner', gameKey: gameKey, loading: true});
    this.loadGame();
  }
  cancelGame(){
    let deleteRef = this.gamesList.child(this.state.gameKey);
    deleteRef.remove();
    this.setState({createdGame: false});
  }
  loadGame(){
    setTimeout(()=>this.setState({loading:false, gameJoined:true}),2000);
  }

  render(){
    if(!this.state.loggedIn){
      return(
        <div style ={bgDiv}>
          <div style = {playingBoard}>
          <LogIn username = {this.state.username} password = {this.state.password} changeUser = {this.changeUser}
            changePass = {this.changePass} handleLogin = {this.handleLogin}/>
        </div>
      </div>
      )
    }
    if(this.state.loading){
      return(
        <div style ={bgDiv}>
          <div style = {playingBoard}>
            <div className = "gamesList">
              <h1>Attempting to join game</h1>
              <Loading />
              </div>
            </div>
          </div>
      )
    }
    if(!this.state.createdGame && !this.state.searchBegin){
      return(
        <div style ={bgDiv}>
          <div style = {playingBoard}>
          <SearchGames submit = {this.createGame} findGames = {this.findGames} />
        </div>
      </div>
      )
    }
    if(this.state.createdGame && !this.state.gameJoined){
      return(
        <div style ={bgDiv}>
          <div style = {playingBoard}>
            <div className = "logIn">
              <h1>Waiting for Opponent</h1>
              <Loading />
              <button style = {{width:"90px",height: "40px", position: "relative", margin: "auto",
                  borderRadius: "8px", background:"white", fontSize: "16px", top: "75px" }}
                  onClick = {this.cancelGame}>Cancel</button>
            </div>
          </div>
        </div>
      )
    }
    if(this.state.searchBegin && !this.state.gameJoined){
      let message = "Click on a user to join their game!"
      if(this.state.gameList.length ===0){
        message = "No Games Available"
      }
      return(
        <div style ={bgDiv}>
          <div style = {playingBoard}>
            <div className = "gamesList">
              <h1>Current Games:</h1>
              <p>{message}</p>
              <Scrollbars style = {{height: "375px", width: "450px"}}>
              {this.state.gameList.map((x,i)=>{
                return(
                  <p key ={i}>
                  <button className = "gameButton" value = {x.gameID} onClick ={this.joinGame}>{x.game.creator.username}</button>
                  </p>
                )
              })}
              </Scrollbars>
            </div>
          </div>
        </div>
      )
    }

    return(
      <div style = {bgDiv}>
        <div style = {playingBoard}>
          <button className = "signOut" onClick = {this.logOut}>Sign Out</button>
          <div className = "points">
            <div className = "playerPoints">{this.state.playerPoints}</div>
            <div className = "oppPoints">{this.state.oppPoints}</div>
          </div>
          <div className = "names">
            <div className = "playerName">{this.state.username}</div>
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
