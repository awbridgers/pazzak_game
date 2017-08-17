# Pazzak
* this project is a react based recreation of the game Pazzak from Knights of the Old Republic
* this project was made using [Create React App](https://github.com/facebookincubator/create-react-app).
## How to play
* The goal of the game is to finish the round with more points than your opponent. If a player ends their turn or stands with over 20 points, they lose.
* Each player starts the game with 4 cards in their hands. These cards range from +6 to -6
* The game always starts with the user's turn
* At the start of a turn, the player receives 1 random green card ranging from 1 to 10. Their score is update according to the value of this card.
* The player can then end their turn, stand, or a play card.
  * End Turn: The player passes the turn over to their opponent, who receives a random card and then chooses one of the 3 moves. The player's turn will begin with another random card once the opponent has made their move.  
  * Stand: The player chooses to lock in their score at the current point amount and will not be allowed to move again until the round is over. The player will no longer receive random cards and the opponent will continue to have turns until the round is over.
  * Play Card: The player picks a card from their hand to add to the playing area to their score. The player must then choose to stand or end their turn.
* A round is won by finishing the game with more points than your opponent but not going over 20 points.
* The first player to win 3 rounds wins the game.


## Author
Adam Bridgers
