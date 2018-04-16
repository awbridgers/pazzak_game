import React, { Component } from 'react';
import board from "./images/pazzakBoard2.png";
import "./pazzakGame.css";
import Chat from "./chatWindow.jsx"
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
import {HashRouter as Router, Route, Switch, Link, withRouter} from 'react-router-dom';


let bgDiv = {width: "100%", height: "100%", backgroundColor: "black", position: "fixed"};
let playingBoard = {height: "628px", width:"828px", margin: "auto", backgroundImage: "url(" + board + ")"}
let boardWithChat = {height: "628px", position: "relative", width:"828px", marginLeft:"3%", backgroundImage: "url(" + board + ")"}

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
const fillPlayerHands = (type) => {
  let possibleCards = [];
  let returnedHand =[];
  possibleCards.push(new gameCards(-6, minusSix));
  possibleCards.push(new gameCards(-5, minusFive));
  possibleCards.push(new gameCards(-4, minusFour));
  possibleCards.push(new gameCards(-3, minusThree));
  possibleCards.push(new gameCards(-2, minusTwo));
  possibleCards.push(new gameCards(-1, minusOne));
  possibleCards.push(new gameCards(1, plusOne));
  possibleCards.push(new gameCards(2, plusTwo));
  possibleCards.push(new gameCards(3, plusThree));
  possibleCards.push(new gameCards(4, plusFour));
  possibleCards.push(new gameCards(5, plusFive));
  possibleCards.push(new gameCards(6, plusSix));
  if(type === "random"){
    for(let i=0; i<=3; i++){
      returnedHand.push(Object.assign({},possibleCards[Math.floor(Math.random()*possibleCards.length)]));
    }
    return returnedHand;
    }
    else{
      return possibleCards;
    }
  }

  const getPlayerCard = (array, number) =>{
    if(number < 0){
      return array[number+6];
    }
    else if (number > 0){
      return array[number + 5];
    }
  }

export class Stands extends Component {
  render(){
    return <div style = {{color: "yellow", textShadow: "-2px 2px 1px4 #000000"}}><h1>STANDS</h1></div>
  }
}
export class NewGame extends Component {
  render(){
    if(this.props.type === "game"){
      return(
      <div className = "newGame">
        <h1>{this.props.winner} wins!</h1>
        <h3>Click to below to start a new game</h3>
        <button onClick = {this.props.onClick} style = {{height: "40px", width: "100px",borderRadius: "8px", fontSize: "16px"}}>
          New Game
        </button>
      </div>
    )}
    else if(this.props.type === "round"){
      return(
      <div className = "newGame">
        {this.props.winner != "tie" && <h1>{this.props.winner} wins the round!</h1>}
        {this.props.winner === 'tie' && <h1>Tie Game!</h1>}
        <h3>Starting next round</h3>
        <Loading />
      </div>
    )}
  }
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

class Online extends Component {
  constructor(){
    super();
    this.pazzakDeck = fillDeck();
    this.playableDeck = fillPlayerHands("ttbt");
    this.state = {playerPoints:0, oppPoints: 0, playerName: "",
      oppName: "", playerWins:0, oppWins:0, playerDefaultCards: [],
      oppDefaultCards: [], playerDeck: [], oppDeck:[],
      playerIsStanding: false, oppIsStanding: false, gameOver : false, roundOver: false, searchBegin: false, loggedIn: false,
      username: "", password:"", gameJoined: false, gameList:[], createdGame: false,gameKey: null,
      role: null, loading: false, gameStarted: false, gameConnected: false, creatorTurn: false, playRandomCard: true,
      oppPlayedCard: false, oppCardsRemaining: 4, chatMessage: "", chatArray:[]}
    this.playersTurn = false;
    this.playerStands = false;
    this.opponentStands = false;
    this.whoseTurn = "joiner";
    this.roundOver = false;
    this.userPlayedCard = false;
    this.whoWon = null;
    this.selectedPlayerCard = 0;
    this.endTurn=this.endTurn.bind(this);
    this.playCard = this.playCard.bind(this);
    this.stand = this.stand.bind(this);
    this.playerGo = this.playerGo.bind(this);
    // this.opponentPlayCard = this.opponentPlayCard.bind(this);
    this.determineWinner = this.determineWinner.bind(this);
    this.newRound = this.newRound.bind(this);
    this.roundEnd = this. roundEnd.bind(this);
    this.newGame = this.newGame.bind(this);
    this.createGame = this.createGame.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.changeUser = this.changeUser.bind(this);
    this.changePass = this.changePass.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.home = this.home.bind(this);
    this.logOut = this.logOut.bind(this);
    this.changeChat = this.changeChat.bind(this);
    this.submitChat = this.submitChat.bind(this);
    this.findGames = this.findGames.bind(this);
    this.updateRandomCard = this.updateRandomCard.bind(this);
    this.joinGame = this.joinGame.bind(this);
    this.cancelGame = this.cancelGame.bind(this);
    this.gamesList = firebase.database().ref('gamesList');
    this.gameLocation = null;
    this.update = false;
    this.addListeners = this.addListeners.bind(this);
    this.listenersAdded = false;
    this.playerIsReady = true;
    this.firstUpdate = true;
    this.standPoints = 0;
    this.pickWinner = false;


  }

  componentDidUpdate(){
    if(this.state.gameOver){
      this.gameStatus.off();
    }
    if(this.state.gameConnected && !this.listenersAdded){
      this.addListeners();
    }


    if(this.state.gameJoined){
      this.creator = this.gamesList.child(this.state.gameKey + "/creator");
      this.joiner = this.gamesList.child(this.state.gameKey + "/joiner");
      this.gameStatus = this.gamesList.child(this.state.gameKey + "/state");
      this.chat = this.gamesList.child(this.state.gameKey + "/chat");

      if(this.state.role === 'creator' && this.state.oppName === ""){
        this.createdGameRef.off();
        this.joiner.once('value').then((snapshot)=>{
          //console.log(snapshot.val())
          let opponentsUsername = snapshot.val().username;
          this.setState({oppName: opponentsUsername, gameBegin: true, gameJoined: false, gameConnected:true,
             playerDeck: fillPlayerHands('random'), oppDeck:fillPlayerHands('random')});
        });
      }
      if(this.state.role === 'joiner' && this.state.oppName === ""){
        this.creator.once('value').then((snapshot)=>{
          //console.log(snapshot.val())
          let opponentsUsername = snapshot.val().username;
          this.setState({oppName: opponentsUsername, gameBegin: true, gameJoined: false, gameConnected:true,
             playerDeck: fillPlayerHands('random'), oppDeck:fillPlayerHands('random')});
        });
      }
      this.gamesList.child(this.state.gameKey).update({state:"joinerTurn"})
    }
    if(this.state.createdGame && !this.state.gameConnected && !this.state.gameJoined){
      this.createdGameRef = this.gamesList.child(this.state.gameKey);
      this.createdGameRef.on('value',(snapshot)=>{
        if(snapshot.val().state === 'joined'){
          this.setState({gameJoined: true, gameBegin: true});
        }
      })
    }

  }
  componentWillMount(){
    let user = firebase.auth().currentUser
    if(user){
      this.setState({loggedIn: true, username: user.displayName})
    }
  }
  addListeners(){
    this.listenersAdded = true;
    this.gameStatus.on('value', (snapshot) =>{
      if(snapshot.val() === "determineWinner"){
        this.pickWinner = true;
        this.updateInfo();
        console.log("1");
      }
      else if(snapshot.val() === "joinerPlayedCard" && this.state.role === 'creator'){
        this.updateRandomCard(this.joiner);
      }
      else if(snapshot.val() === "creatorPlayedCard" && this.state.role === 'joiner'){
        this.updateRandomCard(this.creator);
      }
      else if(snapshot.val() === "joinerTurn" && this.state.role === 'joiner'){
        //if both players are standing, determine the winner
        if(this.state.playerIsStanding && this.state.oppIsStanding){
          this.updateInfo()
          console.log("2");
          this.gamesList.child(this.state.gameKey).update({state:"determineWinner"})
        }
        else{
          console.log("go");
          this.playerGo();
        }
      }
      else if (snapshot.val() === "creatorTurn" && this.state.role === 'creator'){
        if(this.state.playerIsStanding && this.state.oppIsStanding){
          this.updateInfo()
          console.log("3");
          this.gamesList.child(this.state.gameKey).update({state:"determineWinner"})
        }
        else{
          this.update = true;
          this.playerGo();
        }
      }
    })
    this.chat.on('value',(snapshot) => {
      let newMessage = {username:snapshot.val().username, message: snapshot.val().message}
      this.setState({chatArray: [...this.state.chatArray,newMessage]})
    })
  }
  updateInfo(){
    console.log("updating");
    if(this.state.playerIsStanding && this.state.oppIsStanding || (this.state.playerPoints >20 && this.state.oppIsStanding)){
      this.determineWinner()
    }
    //if the player is the joiner
    if(this.state.role === 'joiner' && !this.state.oppIsStanding){
      console.log("joiner update")
      this.creator.once('value').then((snapshot) => {
      let pointsAdded = 0;
        //if the opponent played a card
        if(snapshot.val().gameInfo.playedCard){
          pointsAdded = snapshot.val().gameInfo.playerCardUsed;
          this.setState({
            oppDefaultCards: [...this.state.oppDefaultCards, getPlayerCard(this.playableDeck, snapshot.val().gameInfo.playerCardUsed)],
            oppPlayedCard:snapshot.val().gameInfo.playedCard,
            oppIsStanding: snapshot.val().gameInfo.stands,
            oppPoints: snapshot.val().gameInfo.points,
            oppCardsRemaining: this.state.oppCardsRemaining - 1
          }, this.determineWinner)
        }
            //if the opponent did not play a card
            else if(!snapshot.val().gameInfo.playedCard){
              pointsAdded = snapshot.val().gameInfo.playerCardUsed;
              this.setState({
                oppPlayedCard:snapshot.val().gameInfo.playedCard,
                oppIsStanding: snapshot.val().gameInfo.stands,
                oppPoints: snapshot.val().gameInfo.points,
              }, this.determineWinner)
            }
          })
        }
        //if the player is the creator
        else if(this.state.role === 'creator' && !this.state.oppIsStanding){
          this.joiner.once('value').then((snapshot) => {
            let pointsAdded = 0;
            if(snapshot.val().gameInfo.playedCard){
              pointsAdded = snapshot.val().gameInfo.playerCardUsed;
              this.setState({
                oppDefaultCards: [...this.state.oppDefaultCards,getPlayerCard(this.playableDeck, snapshot.val().gameInfo.playerCardUsed)],
                oppPlayedCard:snapshot.val().gameInfo.playedCard,
                oppIsStanding: snapshot.val().gameInfo.stands,
                oppPoints: snapshot.val().gameInfo.points,
                oppCardsRemaining: this.state.oppCardsRemaining - 1
              }, this.determineWinner)
            }

          else if(!snapshot.val().gameInfo.playedCard){
            pointsAdded = snapshot.val().gameInfo.playerCardUsed;
            this.setState({
              oppPlayedCard:snapshot.val().gameInfo.playedCard,
              oppIsStanding: snapshot.val().gameInfo.stands,
              oppPoints: snapshot.val().gameInfo.points,
            }, this.determineWinner)
          }
        })
      }
    }
  determineWinner(){
    if(this.pickWinner){
      let winner = null
      this.winCondition = null;
      this.roundOver = true;
      //if the user is over 20 and the opp is under, opp wins
      if(this.state.playerPoints > 20 && this.state.oppPoints <= 20){
        winner = "Opponent";
        this.winCondition = "player over 20"
      }
      //if the user is under 20 and the opp goes over, player wins
      else if(this.state.playerPoints <= 20 && this.state.oppPoints > 20){
        winner = "Player";
        this.winCondition = "opponent over 20"
      }
      else if(this.state.playerPoints > this.state.oppPoints && this.state.playerPoints <= 20){
        winner = "Player";
        this.winCondition = "Player has more points"
      }
      else if(this.state.playerPoints < this.state.oppPoints && this.state.oppPoints <=20){
        winner = "Opponent";
        this.winCondition = "Opponent has more points"
      }
      else{
        winner = "Tie";
      }
      setTimeout(()=>{
        console.log(this.winCondition);
        if(winner === "Player"){
          this.roundWinner = this.state.username;
          this.setState({playerWins: this.state.playerWins + 1, roundOver: true});
        }
        else if(winner === "Opponent"){
          this.roundWinner = this.state.oppName;
          this.setState({oppWins: this.state.oppWins + 1, roundOver: true});
        }
        else{
          this.roundWinner = "tie";
          this.setState({roundOver: true});

        }
        this.roundEnd()
      },500);
    }
  }
  playerGo(){
    if(this.playerStands && this.state.role === 'joiner'){
        this.updateInfo();
        this.gamesList.child(this.state.gameKey).update({state:"creatorTurn"})
    }
    if(this.playerStands && this.state.role === "creator"){
        this.updateInfo();
        this.gamesList.child(this.state.gameKey).update({state:"joinerTurn"})
    }
    if(!this.playerStands){
      if(this.update){
        this.updateInfo();
      }
      setTimeout(()=>{
        this.playersTurn = true;
        this.userPlayedCard = false;
        if(this.state.playerDefaultCards.length < 9){
          let random = Math.floor((Math.random() * 10));
          //console.log(random);
          if(this.state.playerPoints + this.pazzakDeck[random].pointValue === 20){
            this.playerIsReady = false;
            this.setState({playerDefaultCards: this.state.playerDefaultCards.concat(this.pazzakDeck[random]),
              playerPoints: this.state.playerPoints + this.pazzakDeck[random].pointValue,playRandomCard:false});
              this.stand();

          }
          else{
            this.playerIsReady = false;
            //update the state with the random card that is selected
            this.setState({playerDefaultCards: this.state.playerDefaultCards.concat(this.pazzakDeck[random]),
              playerPoints: this.state.playerPoints + this.pazzakDeck[random].pointValue,playRandomCard:false},() =>{
                this.gamesList.child(this.state.gameKey + "/" + this.state.role + "/gameInfo").update({
                    gameCardPlayed: this.state.playerDefaultCards[this.state.playerDefaultCards.length-1].pointValue,
                    points: this.state.playerPoints});
                    this.gamesList.child(this.state.gameKey).update({state: this.state.role + "PlayedCard"});
                  });

          }
        }
        else{
          console.log("Out of space");
        }
      },500);
    }
  }
  endTurn(){

    if(this.playersTurn && !this.playerStands){


        //console.log(this.userPlayedCard)
        this.update = true;
        this.playersTurn = false;
        let points = 0;
        if(this.userPlayedCard){

          points = points + this.selectedPlayerCard.pointValue;
        }
        // let subtractor = (this.userPlayedCard) ? 2 : 1;   //if user played a card, subtract 2 for the random card
        let gameInfo = {
          playedCard: this.userPlayedCard,
          playerCardUsed: points,
          playerCardsRemaining: this.state.playerDeck.length,
          stands: this.state.playerIsStanding,
          points: this.state.playerPoints
          }

        if(this.state.role === 'joiner'){
          this.gamesList.child(this.state.gameKey + "/joiner/gameInfo").update(gameInfo);
          this.state.playerPoints > 20 ? this.gamesList.child(this.state.gameKey).update({state:"determineWinner"}) : this.gamesList.child(this.state.gameKey).update({state:"creatorTurn"})
        }
        else if(this.state.role === 'creator'){
          this.gamesList.child(this.state.gameKey + "/creator/gameInfo").update(gameInfo);
          this.state.playerPoints > 20 ? this.gamesList.child(this.state.gameKey).update({state:"determineWinner"}) : this.gamesList.child(this.state.gameKey).update({state:"joinerTurn"})
        }
    }
    else{
      console.log("not your turn");
    }
  }
  playCard(event){
    if(!this.userPlayedCard && !this.playerStands && this.playersTurn){             //if the users hasn't already played a card
      //set this.userPlayedCard to true so they can't play another card
      this.userPlayedCard = true;
      //make copy of state arrays
      const tempArray = this.state.playerDeck.slice();
      const playArray = this.state.playerDefaultCards.slice();
      //make a copy of the selected card object
      this.selectedPlayerCard = Object.assign({}, tempArray[event.target.id]);
      console.log(this.selectedPlayerCard.pointValue)
      //push the new card onto the playing area
      playArray.push(this.selectedPlayerCard);
      //remove the img src from the player's deck
      tempArray[event.target.id].image="";
      //set the state
      if(this.state.playerPoints + this.selectedPlayerCard.pointValue === 20){
        this.firstTimeStand = true;
        this.playerStands = true;
        console.log("Stand Please")
        this.setState({playerDeck: tempArray, playerDefaultCards: playArray,
          playerPoints: this.state.playerPoints + this.selectedPlayerCard.pointValue});
          setTimeout(()=>this.stand(),100);
        }
      else{
        this.setState({playerDeck: tempArray, playerDefaultCards: playArray,
          playerPoints: this.state.playerPoints + this.selectedPlayerCard.pointValue});
      }
    }

    else{
      console.log("You already played a card!")
    }
  }
  stand(){
    if(this.playersTurn && !this.state.playerIsStanding){
      //playerStands true blocks all other user plays
      this.firstTimeStand = true;
      this.update = true;
      this.playersTurn = false;
      this.playerStands = true;
      let points = 0;
      if(this.userPlayedCard){
        points = points + this.selectedPlayerCard.pointValue;
      }
      let subtractor = (this.userPlayedCard) ? 2 : 1;   //if user played a card, subtract 2 for the random card
      let gameInfo = {gameCardPlayed: this.state.playerDefaultCards[this.state.playerDefaultCards.length-subtractor].pointValue,
        playedCard: this.userPlayedCard,
        playerCardUsed: points,
        playerCardsRemaining: this.state.playerDeck.length,
        stands: true,
        points: this.state.playerPoints
        }
      //if you stand with more than 20 points, you lose; determine Winner
      //push the game info to database and then determine winner
      if(this.state.playerPoints > 20 && !this.state.oppIsStanding){
          if(this.state.role === 'joiner'){
            this.gamesList.child(this.state.gameKey + "/joiner/gameInfo").update(gameInfo);
          }
          else if(this.state.role === 'creator'){
            this.gamesList.child(this.state.gameKey + "/creator/gameInfo").update(gameInfo);
          }
          this.gamesList.child(this.state.gameKey).update({state:"determineWinner"})
      }
      //if the player does not have over 20 points, push the info and change the turn
      else if(this.state.role === 'joiner'){
        this.gamesList.child(this.state.gameKey + "/joiner/gameInfo").update(gameInfo);
        this.gamesList.child(this.state.gameKey).update({state:"creatorTurn"})
      }
      else if(this.state.role === 'creator'){
        this.gamesList.child(this.state.gameKey + "/creator/gameInfo").update(gameInfo);
        this.gamesList.child(this.state.gameKey).update({state:"joinerTurn"})
      }
        this.setState({playerIsStanding: true});

    }
    else{
      console.log("You have decided to stand. You can no longer make moves");
    }
  }
  roundEnd(){
    if(this.state.playerWins === 3 || this.state.oppWins === 3){
      this.whoWon = (this.state.playerWins === 3) ? this.state.username : this.state.oppName;
      this.setState({gameOver: true});
    }
    else{
      setTimeout(()=>this.newRound(),3000);
    }
  }
  newRound(){
    //reset the cards and player hands, reset booleans
    //this.startCard = this.pazzakDeck[Math.floor(Math.random()*10)];
    if(this.state.role === "joiner"){
      this.playersTurn = true;
    }

    this.playerStands = false;
    this.pickWinner = false;
    this.opponentStands = false;
    this.update = false;
    this.roundOver = false;
    this.userPlayedCard = false;
    this.setState({playerDefaultCards:[],playerPoints: 0, oppPoints: 0, oppDefaultCards: [],
      playerIsStanding: false, oppIsStanding: false, roundOver: false,});
    setTimeout(()=>this.gamesList.child(this.state.gameKey).update({state:"joinerTurn"}),500);
  }
  newGame(){
    //reset everything except log in and delete the game from the database
    this.chat.off();
    this.gameStatus.off();
    if(this.state.role === 'joiner'){this.gameLocation.remove();}     //only 1 player can delete the game
    this.playersTurn = false;
    this.playerStands = false;
    this.opponentStands = false;
    this.whoseTurn = "joiner";
    this.roundOver = false;
    this.userPlayedCard = false;
    this.whoWon = null;
    this.selectedPlayerCard = 0;
    this.gameLocation = null;
    this.update = false;
    this.listenersAdded = false;

    this.setState({playerPoints:0, oppPoints: 0,oppName: "", playerWins:0, oppWins:0, playerDefaultCards: [],
      oppDefaultCards: [], playerDeck: fillPlayerHands('random'), oppDeck:fillPlayerHands('random'),
      playerIsStanding: false, oppIsStanding: false, gameOver : false, roundOver: false, searchBegin: false,
      gameJoined: false, gameList:[], createdGame: false, gameKey: null,role: null, loading: false,
      gameStarted: false, gameConnected: false, creatorTurn: false, playRandomCard: true,
      oppPlayedCard: false, oppCardsRemaining: 4})
  }

  createGame(event){
    let newRef = this.gamesList.push()
    let createdGameKey = newRef.key;
    let newGame = {
      "creator": {uid:firebase.auth().currentUser.uid, username: this.state.username,
    gameInfo: {stands: false, playedCard: false, playerCardsRemaining: 4, playerCardUsed: 0, gameCardPlayed: 0, points:0}},
      "state": "open",
      chat: {username: "", message: "", time:""}
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
    firebase.auth().signOut().then(()=>{this.props.history.push("/")})
  }
  findGames(){
    this.gamesList.once("value").then((snapshot)=>{
      let currentGames = [];
      snapshot.forEach((childSnapshot)=>{
        if(childSnapshot.val().state === 'open'){
          let game = {gameID:childSnapshot.key, game: childSnapshot.val()}
          currentGames.push(game);
          //console.log(game)
      }})
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
          game.joiner = {uid: firebase.auth().currentUser.uid, username: this.state.username,
          gameInfo:{stands: false, playedCard: false, playerCardsRemaining: 4, playerCardUsed: 0, gameCardPlayed: 0, points:0}};
          game.state = "joined";
        }
        return game;
      }
    })
    this.setState({role: 'joiner', gameKey: gameKey, loading: true});
    this.loadGame();
  }
  cancelGame(){
    this.createdGameRef.off();
    let deleteRef = this.gamesList.child(this.state.gameKey);
    this.createdGameRef.off();
    deleteRef.remove();
    this.setState({createdGame: false});
  }
  loadGame(){
    setTimeout(()=>this.setState({loading:false, gameJoined:true}),1000);
  }
  home(){
    this.newGame();
    this.props.history.push("/");
  }
  changeChat(e){
    this.setState({chatMessage: e.target.value})
  }
  submitChat(){
    this.gamesList.child(this.state.gameKey + "/chat").update({username: this.state.username, message: this.state.chatMessage, time: Date.now()});
    this.setState({chatMessage:""})
    console.log(this.state.chat)
  }

  updateRandomCard(dbRef){
    dbRef.once('value').then((snapshot) => {
      this.setState({
        oppDefaultCards: [...this.state.oppDefaultCards,this.pazzakDeck[snapshot.val().gameInfo.gameCardPlayed-1]],
        oppPoints: snapshot.val().gameInfo.points
      })
    })
  }

  render(){
    if(!this.state.loggedIn){
      return(
        <div style ={bgDiv}>
          <div style = {playingBoard}>
            <button className = "signOut" onClick = {this.logOut}>Sign Out</button>
            <button className = "home" onClick = {this.home}>Home</button>
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
    if(!this.state.createdGame && !this.state.searchBegin && !this.state.gameJoined){
      return(
        <div style ={bgDiv}>
          <div style = {playingBoard}>
            <button className = "signOut" onClick = {this.logOut}>Sign Out</button>
            <button className = "home" onClick = {this.home}>Home</button>
          <SearchGames submit = {this.createGame} findGames = {this.findGames} />
        </div>
      </div>
      )
    }
    if(this.state.createdGame && !this.state.gameConnected){
      return(
        <div style ={bgDiv}>
          <div style = {playingBoard}>
            <button className = "signOut" onClick = {this.logOut}>Sign Out</button>
            <button className = "home" onClick = {this.home}>Home</button>
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
    if(this.state.searchBegin && !this.state.gameJoined && !this.state.gameConnected){
      let message = "Click on a user to join their game!"
      if(this.state.gameList.length ===0){
        message = "No Games Available"
      }
      return(
        <div style ={bgDiv}>
          <div style = {playingBoard}>
            <button className = "signOut" onClick = {this.logOut}>Sign Out</button>
            <button className = "home" onClick = {this.home}>Home</button>
            <div className = "gamesList">
              <h1>Current Games:</h1>
              <button style = {{height: "40px", width: "100px",borderRadius: "8px", fontSize: "16px", marginRight: "10px"}} onClick = {()=>{this.setState({searchBegin: false})}}>Back</button>
              <button style = {{height: "40px", width: "100px",borderRadius: "8px", fontSize: "16px"}} onClick = {this.findGames}>Refresh</button>
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
    if(this.state.gameConnected){
    return(
      <div style = {bgDiv}>
        <div style = {boardWithChat}>
          <button className = "signOut" onClick = {this.logOut}>Sign Out</button>
          <button className = "home" onClick = {this.home}>Home</button>
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
                <td className = "tableData">{this.state.oppCardsRemaining > 0 && <img src = {blankCard} alt=""/>}</td>
                <td className = "tableData">{this.state.oppCardsRemaining > 1 && <img src = {blankCard} alt=""/>}</td>
                <td className = "tableData">{this.state.oppCardsRemaining > 2 && <img src = {blankCard} alt=""/>}</td>
                <td className = "tableData">{this.state.oppCardsRemaining > 3 && <img src = {blankCard} alt=""/>}</td>
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
        <div>
          {this.state.gameOver && <NewGame winner = {this.whoWon} type = "game" onClick = {this.newGame}/>}
          {!this.state.gameOver && this.state.roundOver && <NewGame type = "round" winner = {this.roundWinner}/>}
        </div>
          <Chat onChange = {this.changeChat} submit = {this.submitChat} value = {this.state.chatMessage} array = {this.state.chatArray}/>
        </div>
      </div>
    )}
    return(
      <div style ={bgDiv}>
        <div style = {playingBoard}>
          <button className = "signOut" onClick = {this.logOut}>Sign Out</button>
          <button className = "home" onClick = {this.home}>Home</button>
          </div>
        </div>
    )
  }
  componentWillUnmount(){
    let user = firebase.auth().currentUser
    if(user){
      firebase.auth().signOut();
    }
  }
}

export default withRouter(Online)
