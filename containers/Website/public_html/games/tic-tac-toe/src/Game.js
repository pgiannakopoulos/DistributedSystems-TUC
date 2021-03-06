import React from 'react';
import './index.css';
import * as condition from './utils/gameConditions.js'; 
import * as conn from './utils/multiplayer.js'; 
import * as ui from './utils/messages.js'

//SQUARE
function Square(props) {

    return (
        <button 
          className="square" 
          onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

//BOARD
class Board extends React.Component {
	
	renderSquare(i) {
    	return (
    		<Square 
    			value={this.props.squares[i]}
    			onClick={() => this.props.onClick(i)}
    		/>);
	}

	render() {
		return (
			<div>
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
    	);
    }
}


//GAME
class Game extends React.Component {
	constructor(props) {
    	super(props);

    	//Establish Connection
    	let args = conn.getArgumenets();
    	let data = conn.connect(args['host']+':'+args['playmanster'],args['token'])
    	
    	this.state = {
    		host: args['host'],
    		gamemaster: args['gamemaster'],
      		squares: Array(9).fill(null),
    		myTurn: false,
    		token: args['token'],
    		socket: data['socket'],
    		status: data['status'],
    		type: null,
    		roundID: null,
    	};

    	//set event handlers for server messages
    	conn.setListeners(this);
  	}

  	
	handleClick(i){
	  	if (this.state.myTurn && this.state.state !== 5) {
			const squares = this.state.squares.slice();   //create a copy of the array

			//if the game is over or the sqare is already filled, return
			if (condition.calculateWinner(squares) || squares[i]){
				return;
			}

			squares[i] = this.state.type;
			
			this.setState({
				squares: squares,
				myTurn: !this.state.myTurn,
			});

			let winner = condition.calculateWinner(squares);
			let endgame = condition.isGameEnded(squares);
			var progress = 0;

			if (winner === this.state.type) {   //check if you won
				progress = 1;
			}else if (winner === null && endgame) {  //the game is ended and nobody won
				progress = 2;
			}

			//check if the game is ended
			if(endgame || winner){
				this.setState({
					status: 3,
				});
	
			}

			let message = {
				roundID : this.state.roundID,
				board : squares,
				progress: progress,
			}

			console.log(message)

			this.state.socket.emit('update', message)
		}
	}
	
	// // Setup the `beforeunload` event listener
	// setupBeforeUnloadListener() {
	//     window.addEventListener("beforeunload", (ev) => {
	//         ev.preventDefault();
	//         return 'Are you sure you want to leave?';
	//     });
	// }

	// componentDidMount() {
 //        // Activate the event listener
 //        this.setupBeforeUnloadListener();
 //    }

	render() {
		let winner = condition.calculateWinner(this.state.squares);
		let gameOver = condition.isGameEnded(this.state.squares);
  		let status = ui.showGameStatus(this.state.status);
  		let endState = ui.showWinner(winner, this.state.type, gameOver, this.state.status);
  		
  		if (this.state.status !== 5) {
	  		var turn = ui.showTurn(this.state.status, this.state.myTurn);
	  		var symbol = ui.showSymbol(this.state.type)
	  	}
	  	
    	return (
			<div className="game">
				<div className="game-title">
					<div>Tic - Tac - Toe</div>
				</div>

				<div className="game-board">
					<Board 
						squares={this.state.squares}
						onClick={(i) => this.handleClick(i)}
					/>
				</div>

				<div className="game-info row">
					<div className="status column left">
						<div>{symbol}</div>
						<div>{status}</div>
					 	<div>{turn}</div>
					 </div>
					 <div className="column right">
					 	<div id="endstate">{endState}</div>
					 </div>
				</div>
			</div>
    );
  }
}

export default Game;