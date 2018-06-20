"use strict";
import Color from '../color.mjs';

class Player {
  constructor(c, e, depth) {
    this._color = c;
    this._engine = e;
    this._depth = depth;


    //  this._case_of_interest = [];

  }

  //fonction qui gene l'autre
  //fonction qui prefere centre les jetons
  //fonction qui fait des lignes de 3
  //fonction qui fait des lignes à côté des points d'intérêt(=les 2 extremites des lignes de 3)
  //fonction qui fait check si possibilité de gagner ou d'empecher l'autre de gagner


  move() {
    let e = this._engine.clone();

    let max = null;
    let possibleMoves = e.get_possible_move_list();
    let chosenMoves = [];

    this._init_case_interest();
    this._actualise_case_interest(this._engine, this._color);
    this._actualise_case_disinterest(this._engine, this._color);

    for (let coup = 0; coup < possibleMoves.length; coup++) {
      let move = possibleMoves[coup];


      e.move(move);

        let tmpMax = this._negamax(e, this._depth - 1, this._color,move);

     // let tmpMax = this._evaluate(this._engine, this._color, move.column(), move.line());

      e.undo_move(move);

      if (max === null || tmpMax > max) {
        max = tmpMax;
        chosenMoves = [];
        chosenMoves.push(possibleMoves[coup]);
      } else if (tmpMax === max) {
        chosenMoves.push(possibleMoves[coup]);
      }
    }

    return chosenMoves[Math.floor(Math.random() * (chosenMoves.length - 1))];
  }

  _negamax(e, depth, c,action) {
    if (depth === 0 || e.is_finished()) {
      return ((c === this._color) ? this._evaluate(this._engine, this._color, action.column(), action.line()) : -this._evaluate(this._engine, this._color, action.column(), action.line())) ;
    }

    let possibleMoves = e.get_possible_move_list();
    let best_value = -Infinity;
    let b2 = e.clone();

    for (let i = 0; i < possibleMoves.length; i++) {

      let move = possibleMoves[i];
      b2.move(move);

      let tmp = -this._negamax(b2, this._depth - 1,this._color,move);
      b2.undo_move(move);

      if(tmp > best_value )
      {
        best_value = tmp;
      }


    }

    return best_value;
  }


  _evaluate(e, c, column, line) {
    let WIN_SCORE = 10000;
    let LOSE_SCORE = 10000;
    //   let board = e._board;

    let score = 0;


    let _compteur_connect42win = e._check_double_4(column, line, c);
    if (_compteur_connect42win > 1) {
      score = WIN_SCORE;
      return score;
    }
    let _compteur_connect42lose = e._check_double_4(column, line, e.alt_color());
    if (_compteur_connect42lose > 1) {
      score = LOSE_SCORE;
      return score;
    }

    //   let center = _center_points(e,c,column,line);
   let interest = this._near_interest(e, c, column, line);//a côté d'une case à vic potentiel
    let disinterest = this._on_disinterest(column, line); //case victoire potentiel

    let multi_interest = this._multiple_interest(e, column, line);

    let enemi_disinterest = -this._on_disinterest(column, line);

    let confort = this._friends(e, c, column, line);
    let disconfort = this._embarrassing(e, c, column, line);

    this._actualise_case_interest(e, this._engine.alt_color());
    this._actualise_case_disinterest(e, this._engine.alt_color());

    score = score + interest + disinterest + multi_interest + enemi_disinterest + disconfort + confort;
//score = score + confort;

    return score;
  }


  _near_interest(e, c, column, line) {
    let interesting_points = 0;

    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (e._case_in_grid(column + i, line + j) && this._case_of_interest[column + i][line + j]) {
          //interesting_points = interesting_points + 200;
          return 200;
        }
      }
    }
    return interesting_points ;
  }

  _multiple_interest(e, column, line) {

    for (let ab = 0; ab < 13; ab++) {
      for (let ac = 0; ac < 13; ac++) {
        this._remplir_tableau(e, ab, ac)
      }
    }
//à modifier pour etre dans la continuité de la ligne
let points = 0;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if ((i !== 0 || j !== 0) && e._case_in_grid(column + i, line + j) && this._case_of_multiple_interest[column + i][line + j]) {

          if(e._case_in_grid(column + 2*i, line + 2*j) && (this._case_of_interest[column+ 2*i][line+2*j] || this._case_of_multiple_interest[column+ 2*i][line+2*j]))
          {
            points = points + 300;
          }
        }
      }
    }

    return points;
  }

  _remplir_tableau(e, x, y) {
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if ((i !== 0 || j !== 0) && e._case_in_grid(x + i, y + j) && this._case_of_interest[x + i][y + j] && !this._case_of_disinterest[x][y]) {

          if(e._case_in_grid(x + 2*i, y + 2*j) && (this._case_of_interest[x+ 2*i][y+2*j] || this._case_of_multiple_interest[x+ 2*i][y+2*j]))
          {
            this._case_of_multiple_interest[x][y] = 1;
          }
        }
      }
    }
  }

  _embarrassing(e, c, column, line) {
    let embarrassing_points = 0;

    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (e._case_in_grid(column + i, line + j) && e._board[column + i][line + j] === e.alt_color()) {
          embarrassing_points = embarrassing_points + 3;
        }
      }
    }
    return embarrassing_points;
  }

  _friends(e, c, column, line) {
    let friends_points = 0;


    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (e._case_in_grid(column + i, line + j) && e._board[column + i][line + j] === c) {
          let x = 1;
          while (e._board[column + i * x][line + j * x] === e._board[column][line]) {
            friends_points = friends_points + 50;
            x = x + 1;
          }
        }

      }
    }


    return friends_points;
  }

  _on_disinterest(column, line) {
    if (this._case_of_disinterest[column][line] === 1) {
      return -50000;
    }
    return 0;
  }

  _actualise_case_interest(e, c) {


    for (let x = 0; x < 13; x++) {
      for (let y = 0; y < 13; y++) {
        if (e._free_case(x, y) && e._check_double_4(x, y, c) === 1) {
          this._case_of_interest[x][y] = 1;
        }
      }
    }

  }

  _actualise_case_disinterest(e, c) {
//fonction qui évite de faire des lignes de 5

    for (let x = 0; x < 13; x++) {
      for (let y = 0; y < 13; y++) {

        if (this._case_of_interest[x][y]) {
          e._winning_piece(x, y, c);
          if (e._win_piece[0] === 1 && e._case_in_grid(x - (e._win_piece[1] + 1), y) && e._free_case(x - (e._win_piece[1] + 1), y)) {

            this._case_of_disinterest[x - (e._win_piece[1] + 1)][y] = 1;
          }
          if (e._win_piece[0] === 1 && e._case_in_grid(x + (e._win_piece[2] + 1), y) && e._free_case(x + (e._win_piece[2] + 1), y)) {

            this._case_of_disinterest[x + (e._win_piece[2] + 1)][y] = 1;
          }
          if (e._win_piece[3] === 1 && e._case_in_grid(x, y + (e._win_piece[3] + 1)) && e._free_case(x, y + (e._win_piece[3] + 1))) {

            this._case_of_disinterest[x][y + (e._win_piece[3] + 1)] = 1;
          }
          if (e._win_piece[3] === 1 && e._case_in_grid(x, y - (e._win_piece[4] + 1)) && e._free_case(x, y - (e._win_piece[4] + 1))) {

            this._case_of_disinterest[x][y - (e._win_piece[4] + 1)] = 1;
          }
          if (e._win_piece[6] === 1 && e._case_in_grid(x - (e._win_piece[7] + 1), y + (e._win_piece[7] + 1)) && e._free_case(x - (e._win_piece[7] + 1), y + (e._win_piece[7] + 1))) {

            this._case_of_disinterest[x - (e._win_piece[7] + 1)][y + (e._win_piece[7] + 1)] = 1;
          }
          if (e._win_piece[6] === 1 && e._case_in_grid(x + (e._win_piece[8] + 1), y - (e._win_piece[8] + 1)) && e._free_case(x + (e._win_piece[8] + 1), y - (e._win_piece[8] + 1))) {

            this._case_of_disinterest[x + (e._win_piece[8] + 1)][y - (e._win_piece[8] + 1)] = 1;
          }
          if (e._win_piece[9] === 1 && e._case_in_grid(x - (e._win_piece[10] + 1), y - (e._win_piece[10] + 1)) && e._free_case(x - (e._win_piece[10] + 1), y - (e._win_piece[10] + 1))) {

            this._case_of_disinterest[x - (e._win_piece[10] + 1)][y - (e._win_piece[10] + 1)] = 1;
          }
          if (e._win_piece[9] === 1 && e._case_in_grid(x + (e._win_piece[11] + 1), y + (e._win_piece[11] + 1)) && e._free_case(x + (e._win_piece[11] + 1), y + (e._win_piece[11] + 1))) {

            this._case_of_disinterest[x + (e._win_piece[11] + 1)][y + (e._win_piece[11] + 1)] = 1;
          }
        }
      }
    }
  }

  _init_case_interest() {
    this._case_of_interest = new Array(13);
    this._case_of_disinterest = new Array(13);
    this._case_of_multiple_interest = new Array(13);

    for (let size = 0; size < 13; size++) {
      this._case_of_interest[size] = new Array(13);
      this._case_of_disinterest[size] = new Array(13);
      this._case_of_multiple_interest[size] = new Array(13);
    }

    for (let x = 0; x < 13; x++) {
      for (let y = 0; y < 13; y++) {
        this._case_of_interest[x][y] = 0;
        this._case_of_disinterest[x][y] = 0;
        this._case_of_multiple_interest[x][y] = 0;
      }
    }
  }





}

export default {
  Player: Player
};

