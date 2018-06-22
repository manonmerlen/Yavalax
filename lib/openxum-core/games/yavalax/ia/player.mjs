"use strict";

class Player {
  constructor(c, e, depth) {
    this._color = c;
    this._engine = e;
    this._depth = depth;
  }


  move() {
    let e = this._engine.clone();
    let max = null;
    let possibleMoves = e.get_possible_move_list();
    let chosenMoves = [];

    for (let coup = 0; coup < possibleMoves.length; coup++) {
      let move = possibleMoves[coup];
      e.move(move);
      let tmpMax = this._profundity(e, this._depth - 1,50,-50, e._previous_player, move);
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

  _actualise_case_disinterest(e, c) {
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

  _actualise_case_interest(e, c) {
    for (let x = 0; x < 13; x++) {
      for (let y = 0; y < 13; y++) {
        if (e._free_case(x, y) && e._check_double_4(x, y, c) === 1) {
          this._case_of_interest[x][y] = 1;
        }
      }
    }
  }

  static _center_points(column, line) {
    if (column >= 10 || line >= 10) {
      return 2;
    }
    if (column <= 4 || line <= 4) {
      return 4;
    }
    if (column === 7 && line === 7) {
      return 20;
    }
    return 10;
  }

  static _embarrassing(e, column, line) {
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

  _evaluate(e, c, column, line) {
    let WIN_SCORE = 100002;
    let LOSE_SCORE = 100001;
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
    this._init_case_interest();
    this._actualise_case_interest(e, c);
    this._actualise_case_disinterest(e, c);
    this._actualise_case_interest(e, c);

    let center = Player._center_points(column, line);
    let follow = Player._follow(e, c, column, line);
    let interest = this._near_interest(e, column, line);
    let disinterest = this._on_disinterest(column, line);
    let multi_interest = this._multiple_interest(e, column, line);
    let confort = Player._friends(e, c, column, line);
    let disconfort = Player._embarrassing(e, column, line);
    this._actualise_case_interest(e, e.alt_color());
    let counter = this._in_enemi_interest(column, line);
    score = score + center + follow + interest + disinterest + multi_interest + disconfort + confort + counter;
    return score;
  }

  static _follow(e, c, column, line) {
    let points = 0;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if ((i !== 0 || j !== 0) && e._case_in_grid(column + i, line + j) && e._board[column + i][line + j] === c) {
          points = points + 40;
          if (e._case_in_grid(column + 2 * i, line + 2 * j) && e._board[column + i * 2][line + j * 2] === c) {
            points = points + 100;
          }
        }
      }
    }
    return points;
  }

  static _friends(e, c, column, line) {
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

  _in_enemi_interest(column, line) {

    if (this._case_of_interest[column][line] === 1) {
      return 10000;
    }
    return 0;
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

  _profundity(e, depth,a,b, c, action) {
    if (depth === 0 ) { //|| e.is_finished()
      return ((c === e._previous_player) ? this._evaluate(this._engine, c, action.column(), action.line()) : -this._evaluate(this._engine, c, action.column(), action.line()));
    }
//l'algo arrive pas ici, on a pas réussi à bien faire fonctionner l'IA en profondeur
      let b2 = e.clone();
      let possibleMoves = b2.get_possible_move_list();
      for (let i = 0; i < possibleMoves.length; i++) {
        let move = possibleMoves[i];
        b2.move(move);
        let tmp = -this._profundity(b2, this._depth - 1, a, b, b2._previous_player, move);
        b2.undo_move(move);
        if (tmp > a) {
          a = tmp;
          if (tmp >= b) {
            return tmp;
          }
        }
      }
      return a;
  }

  _multiple_interest(e, column, line) {

    for (let ab = 0; ab < 13; ab++) {
      for (let ac = 0; ac < 13; ac++) {
        this._remplir_tableau(e, ab, ac)
      }
    }
    let points = 0;

    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if ((i !== 0 || j !== 0) && e._case_in_grid(column + i, line + j) && this._case_of_multiple_interest[column][line]) {
          if (e._case_in_grid(column + 2 * i, line + 2 * j) && (this._case_of_interest[column + 2 * i][line + 2 * j] || this._case_of_multiple_interest[column + 2 * i][line + 2 * j])) {
            points = points + 200;
          }
        }
      }
    }
    return points;
  }

  _near_interest(e, column, line) {
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (e._case_in_grid(column + i, line + j) && this._case_of_interest[column + i][line + j]) {
          return 50;
        }
      }
    }
    return 0;
  }

  _on_disinterest(column, line) {
    if (this._case_of_disinterest[column][line] === 1) {
      return -500;
    }
    return 0;
  }

  _remplir_tableau(e, x, y) {
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if ((i !== 0 || j !== 0) && e._case_in_grid(x + i, y + j) && this._case_of_interest[x + i][y + j] && !this._case_of_disinterest[x][y]) {
          if (e._case_in_grid(x + 2 * i, y + 2 * j) && (this._case_of_interest[x + 2 * i][y + 2 * j] || this._case_of_multiple_interest[x + 2 * i][y + 2 * j])) {
            this._case_of_multiple_interest[x][y] = 1;
          }
        }
      }
    }
  }


}

export default {
  Player: Player
};

