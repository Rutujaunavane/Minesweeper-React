import React, { Component } from 'react';
import Cell from './Cell';
import BoardStyle from './Board.css';
import CellStyle from './Cell.css';

export default class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
    	board: [],
      unrevealed_count: 160,
      level: 'Intermediate',
      row_count: 10,
      col_count: 20,
      bombs: 40
    };
    this.setMark = this.setMark.bind(this);
    this.revealCells = this.revealCells.bind(this);
    this.initBoard = this.initBoard.bind(this);
    this.checkIfWon = this.checkIfWon.bind(this);
    this.setLevel = this.setLevel.bind(this);
    this.renderBoard = this.renderBoard.bind(this);
    this.generateBombs = this.generateBombs.bind(this);
    this.setActiveNeighbours = this.setActiveNeighbours.bind(this);
  }

  componentWillMount() {
  	this.initBoard();
  }

  initBoard() {
    console.log('initBoard level is ', this.state.level);
    let board = [], unrevealed_count, row_count, col_count, bombs;
    switch(this.state.level) {
      case 'Beginners':
        unrevealed_count = 90;
        row_count = 10;
        col_count = 10;
        bombs = 10;
        break;
      case 'Intermediate':
        unrevealed_count = 160;
        row_count = 10;
        col_count = 20;
        bombs = 40;
        break;
      case 'Expert':
        unrevealed_count = 220;
        row_count = 15;
        col_count = 20;
        bombs = 80;
        break;
    }
    for (let i=0; i<row_count; i++) {
      board.push([]);
      for (let j=0; j<col_count; j++) {
        board[i].push({
          isRevealed: false,
          activeNeighbours: 0,
          value: '',
          isBomb: false
        });
      }
    }
    this.setState({
      board: board,
      unrevealed_count: unrevealed_count,
      row_count: row_count,
      col_count: col_count,
      bombs: bombs
    }, this.generateBombs);
  }

  renderBoard() {
  	let board = [];
  	for (let i=0; i<this.state.row_count; i++) {
  		board.push([]);
  		for (let j=0; j<this.state.col_count; j++) {
  			let key = `${i}-${j}`;
        // console.log('state is ', i, j, this.state.board[i][j]);
  			board[i].push(<Cell key={key}
                            cell={this.state.board[i][j]}
                            rowIndex={i}
                            colIndex={j}
                            setMark={this.setMark}
                            revealCells={this.revealCells} />);
  		}
      board[i].push((<div className={CellStyle.clearcell}></div>));
  	}
  	
    return board;
  }

  generateBombs() {
    let board = this.state.board;
    for (let i=0; i<this.state.bombs; i++) {
      this.generateBomb(board);
    }
    this.setState({
      board: board
    }, this.setActiveNeighbours);
  }

  generateBomb(board) {
    let x = Math.floor(Math.random()*this.state.row_count);
    let y = Math.floor(Math.random()*this.state.col_count);
    if (board[x][y].isBomb) {
      return this.generateBomb(board);
    }
    console.log('x,y is ', x, y);
    board[x][y].isBomb = true;
  }

  setMark(row, col) {
    let board = this.state.board;
    if (board[row][col].isRevealed)
      return;
    switch(board[row][col].value) {
      case 'X':
        board[row][col].value = '?';
        break;

      case '?':
        board[row][col].value = '';
        break;

      case '':
        board[row][col].value = 'X';
        break;      
    }
    this.setState({
      board: board
    });
  }

  setActiveNeighbours() {
    let board = this.state.board, activeNeighbours;
    for (let i=0; i<this.state.row_count; i++) {
      for (let j=0; j<this.state.col_count; j++) {
        activeNeighbours = 0;
        let k = i-1, l;
        if (k > -1) {
          for (l= j-1>-1 ? j-1:j;l<this.state.col_count && l<j+2; l++) {
            activeNeighbours += board[k][l].isBomb ? 1:0;
          }
        }
        l = j+1;
        k = i;
        if (l < this.state.col_count) {
          activeNeighbours += board[k][l].isBomb ? 1:0;
        }
        k = i+1;
        if (k < this.state.row_count) {
          for (l= j+1 < this.state.col_count ? j+1 : j; l>-1 && l>j-2; l--) {
            activeNeighbours += board[k][l].isBomb ? 1:0;
          }
        }
        l = j-1;
        k = i;
        if (l > -1) {
          activeNeighbours += board[k][l].isBomb ? 1:0;
        }
        board[i][j].activeNeighbours = activeNeighbours;
      }
    }
    this.setState({
      board: board
    });
  }

  checkIfWon() {
    if (this.state.unrevealed_count === 0) {
      alert("You Won !");
      this.initBoard();
    } else if (this.state.unrevealed_count === -1) {
      alert("You Lost !");
      this.initBoard();
    }
  }

  revealCells(row, col) {
    let board = this.state.board, unrevealed_count = this.state.unrevealed_count;
    unrevealed_count = this.reveal(row, col, board, unrevealed_count);
    this.setState({
      board: board,
      unrevealed_count: unrevealed_count
    }, this.checkIfWon);
  }

  reveal(row, col, board, unrevealed_count) {
    if (board[row][col].isRevealed)
      return unrevealed_count;
    if (board[row][col].isBomb)
      return -1;
    board[row][col].isRevealed = true;
    board[row][col].value = board[row][col].activeNeighbours;
    unrevealed_count--;
    if (board[row][col].activeNeighbours === 0) {
      let k = row-1, l;
      if (k > -1) {
        for (l=col-1; l>-1 && l<this.state.col_count && l<col+2; l++) {
          unrevealed_count = this.reveal(k, l, board, unrevealed_count);
        }
      }
      l = col+1;
      k = row;
      if (l < this.state.col_count) {
        unrevealed_count = this.reveal(k, l, board, unrevealed_count);
      }
      k = row+1;
      if (k < this.state.row_count) {
        for (l=col+1; l>-1 && l<this.state.col_count && l>col-2; l--) {
          unrevealed_count = this.reveal(k, l, board, unrevealed_count);
        }
      }
      l = col-1;
      k = row;
      if (l > -1) {
        unrevealed_count = this.reveal(k, l, board, unrevealed_count);
      }
    }
    return unrevealed_count;
  }

  setLevel(event) {
    console.log('event is ', event.target.value);
    this.setState({
      level: event.target.value
    }, this.initBoard);
  }

  render() {
    return (
      <div>
        <div>
          <button className={BoardStyle.startbutton} onClick={this.initBoard}>Start</button>
        </div>
        <div className={BoardStyle.levels}>
          <div className={BoardStyle.levelsheading}>
            Levels
          </div>
          <div className={BoardStyle.levelschild}>
            <div className={BoardStyle.levelsfield}>
              <input type="radio" name="level" value="Beginners" checked={this.state.level === 'Beginners'} onChange={this.setLevel} id="Beginners" />
              <label for="Beginners">Beginners</label>
            </div>
            <div className={BoardStyle.levelsfield}>
              <input type="radio" name="level" value="Intermediate" checked={this.state.level === 'Intermediate'} onChange={this.setLevel} id="Intermediate" />
              <label for="Intermediate">Intermediate</label>
            </div>
            <div className={BoardStyle.levelsfield}>
              <input type="radio" name="level" value="Expert" checked={this.state.level === 'Expert'} onChange={this.setLevel} id="Expert" />
              <label for="Expert">Expert</label>
            </div>
          </div>
          <div className={CellStyle.clearcell}></div>
        </div>
        <div className={BoardStyle.board}>
          {this.renderBoard()}
        </div>
      </div>
    );
  }
}
