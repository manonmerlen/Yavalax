"use strict";

import OpenXum from '../../openxum/engine.mjs';

import Move from './move.mjs';
import Color from './color.mjs';


class Engine extends OpenXum.Engine {
  constructor(t, c) {
    super();

    this._type = t;
    this._color = c;
    this.cptwhite = 1;
    this.cptblue = -1;
    this._initialize_board();
    this._winner = false;
    this.color_winner = Color.NONE;
    this.last_column = 0;
    this.last_line = 0;
    this._win_piece = [];
    this.equality = false;
    this._previous_player = Color.NONE;

  }

  apply_moves(moves) {
  }

  clone() {
    let o = new Engine(this._type, this._color);

    for (let x = 0; x < 13; x++) {
      for (let y = 0; y < 13; y++) {
        if (this._board[x][y] !== undefined) {
          o._board[x][y] = this._board[x][y];
        }
      }
    }
    o._color = this._color;
    o.cptwhite = this.cptwhite;
    o.cptblue = this.cptblue;
    o._winner = this._winner;
    o.color_winner = this.color_winner;
    o.last_column = this.last_column;
    o.last_line = this.last_line;
    o._win_piece = this._win_piece;
    o.equality = this.equality;
    o._previous_player = this._previous_player;
    return o;
  }

  current_color() {
    return this._color;
  }

  alt_color() {
    if (this._color === Color.WHITE) {
      return Color.BLUE;
    }
    return Color.WHITE;
  }

  get_name() {
    return 'Yavalax';
  }

  get_possible_move_list() {
    let moves = [];
    for (let column = 0; column < 13; column++) {
      for (let line = 0; line < 13; line++) {
        if (this._valid_move(column, line, this.current_color())) {
          moves.push(new Move(column, line, this.current_color()));
        }
      }
    }
    return moves;
  }

  is_finished() {
    return this._winner;
  }

  move(move) {
    this._board[move.column()][move.line()] = move.color();
    this.last_column = move.column();
    this.last_line = move.line();
    this._actualise_winner(move.column(), move.line(), move.color());

    if (this._winner && this.equality === false) {
      this._winning_piece(move.column(), move.line(), move.color());
      this.color_winner = move.color();
      return true;
    }
    if (this._winner && this.equality) {
      return true;
    }
    this._previous_player = this._color;
    this._change_player();

    let i = 0;
    for (let column = 0; column < 13; column++) {
      for (let line = 0; line < 13; line++) {
        if (this._valid_move(column, line, this.current_color())) {
          i++;
        }
      }
    }
    if (i === 0) {
      this._winner = true;
      this.equality = true;
    }
    return true;
  }

  undo_move(move) {
    this._board[move.column()][move.line()] = Color.NONE;
    this._winner = false;
    this._undo_change_player();
  }

  parse(str) {
  }

  to_string() {
  }

  winner_is() {
    return this.color_winner;
  }

  _actualise_winner(column, line, color) {
    if (this._check_double_4(column, line, color) > 1) {
      this._winner = true;
    }
    if (this.get_possible_move_list().length === 0) {
      this._winner = true;
      this.equality = true;
    }
    return false;
  }

  _case_in_grid(column, line) {
    if (column < 0 || column > 12 || line < 0 || line > 12) {
      return false;
    }
    return true;
  }

  _change_player() {
    if (this.cptwhite === 1) {
      this._color = Color.BLUE;
      this.cptwhite = -1;
      this.cptblue = 0;
      return;
    }
    if (this.cptwhite === 0) {
      this.cptwhite = 1;
      return;
    }
    if (this.cptblue === 0) {
      this.cptblue = 1;
      return;
    }
    if (this.cptblue === 1) {
      this._color = Color.WHITE;
      this.cptblue = -1;
      this.cptwhite = 0;
      return;
    }
  }

  _check_5(column, line, color) {
    let tabz = new Array(6);
    for (let x = 0; x < 5; x++) {
      tabz[x] = 0;
    }
    tabz[0] = column;
    tabz[1] = line;
    while (tabz[0] - 1 > -1 && this._board[tabz[0] - 1][tabz[1]] === color) {
      tabz[0] = tabz[0] - 1;
      tabz[2] = tabz[2] + 1;
    }
    tabz[0] = column;
    while (tabz[0] + 1 < 13 && this._board[tabz[0] + 1][tabz[1]] === color) {
      tabz[0] = tabz[0] + 1;
      tabz[2] = tabz[2] + 1;
    }
    if (tabz[2] > 3) {
      return false;
    }
    tabz[0] = column;
    tabz[1] = line;
    while (tabz[1] + 1 < 13 && this._board[tabz[0]][tabz[1] + 1] === color) {
      tabz[1] = tabz[1] + 1;
      tabz[3] = tabz[3] + 1;
    }
    tabz[1] = line;
    while (this._case_in_grid(tabz[0], tabz[1] - 1) && this._board[tabz[0]][tabz[1] - 1] === color) {
      tabz[1] = tabz[1] - 1;
      tabz[3] = tabz[3] + 1;
    }
    if (tabz[3] > 3) {
      return false;
    }
    tabz[0] = column;
    tabz[1] = line;
    while (tabz[0] - 1 > -1 && tabz[1] + 1 < 13 && this._board[tabz[0] - 1][tabz[1] + 1] === color) {
      tabz[0] = tabz[0] - 1;
      tabz[1] = tabz[1] + 1;
      tabz[4] = tabz[4] + 1;
    }
    tabz[0] = column;
    tabz[1] = line;
    while (tabz[0] + 1 < 13 && tabz[1] - 1 > -1 && this._board[tabz[0] + 1][tabz[1] - 1] === color) {
      tabz[0] = tabz[0] + 1;
      tabz[1] = tabz[1] - 1;
      tabz[4] = tabz[4] + 1;
    }
    if (tabz[4] > 3) {
      return false;
    }
    tabz[0] = column;
    tabz[1] = line;
    while (tabz[0] - 1 > -1 && tabz[1] - 1 > -1 && this._board[tabz[0] - 1][tabz[1] - 1] === color) {
      tabz[0] = tabz[0] - 1;
      tabz[1] = tabz[1] - 1;
      tabz[5] = tabz[5] + 1;
    }
    tabz[0] = column;
    tabz[1] = line;
    while (tabz[0] + 1 < 13 && tabz[1] + 1 < 13 && this._board[tabz[0] + 1][tabz[1] + 1] === color) {
      tabz[0] = tabz[0] + 1;
      tabz[1] = tabz[1] + 1;
      tabz[5] = tabz[5] + 1;
    }
    if (tabz[5] > 3) {
      return false;
    }
    return true;
  }

  _check_double_4(column, line, color) {
    let tabz = new Array(6);
    for (let x = 0; x < 5; x++) {
      tabz[x] = 0;
    }
    tabz[0] = column;
    tabz[1] = line;
    while (tabz[0] - 1 > -1 && this._board[tabz[0] - 1][tabz[1]] === color) {
      tabz[0] = tabz[0] - 1;
      tabz[2] = tabz[2] + 1;
    }
    tabz[0] = column;
    while (tabz[0] + 1 < 13 && this._board[tabz[0] + 1][tabz[1]] === color) {
      tabz[0] = tabz[0] + 1;
      tabz[2] = tabz[2] + 1;
    }
    tabz[0] = column;
    tabz[1] = line;
    while (tabz[1] + 1 < 13 && this._board[tabz[0]][tabz[1] + 1] === color) {
      tabz[1] = tabz[1] + 1;
      tabz[3] = tabz[3] + 1;
    }
    tabz[1] = line;
    while (tabz[1] - 1 > -1 && this._board[tabz[0]][tabz[1] - 1] === color) {
      tabz[1] = tabz[1] - 1;
      tabz[3] = tabz[3] + 1;
    }
    tabz[0] = column;
    tabz[1] = line;
    while (tabz[0] - 1 > -1 && tabz[1] + 1 < 13 && this._board[tabz[0] - 1][tabz[1] + 1] === color) {
      tabz[0] = tabz[0] - 1;
      tabz[1] = tabz[1] + 1;
      tabz[4] = tabz[4] + 1;
    }
    tabz[0] = column;
    tabz[1] = line;
    while (tabz[0] + 1 < 13 && tabz[1] - 1 > -1 && this._board[tabz[0] + 1][tabz[1] - 1] === color) {
      tabz[0] = tabz[0] + 1;
      tabz[1] = tabz[1] - 1;
      tabz[4] = tabz[4] + 1;
    }
    tabz[0] = column;
    tabz[1] = line;
    while (tabz[0] - 1 > -1 && tabz[1] - 1 > -1 && this._board[tabz[0] - 1][tabz[1] - 1] === color) {
      tabz[0] = tabz[0] - 1;
      tabz[1] = tabz[1] - 1;
      tabz[5] = tabz[5] + 1;
    }
    tabz[0] = column;
    tabz[1] = line;
    while (tabz[0] + 1 < 13 && tabz[1] + 1 < 13 && this._board[tabz[0] + 1][tabz[1] + 1] === color) {
      tabz[0] = tabz[0] + 1;
      tabz[1] = tabz[1] + 1;
      tabz[5] = tabz[5] + 1;
    }
    let _potential_victory_cpt = 0;
    if (tabz[2] === 3) {
      _potential_victory_cpt++;
    }
    if (tabz[3] === 3) {
      _potential_victory_cpt++;
    }
    if (tabz[4] === 3) {
      _potential_victory_cpt++;
    }
    if (tabz[5] === 3) {
      _potential_victory_cpt++;
    }
    return _potential_victory_cpt;
  }

  _check_full() {
    for (let column = 0; column < 13; column++) {
      for (let line = 0; line < 13; line++) {
        if (this._valid_move(column, line, this.current_color())) {
          return false;
        }
      }
    }
    return true;
  }

  _free_case(column, line) {
    if (this._board[column][line] === Color.NONE) {
      return true;
    }
    return false;
  }

  _initialize_board() {
    this._board = new Array(13);
    for (let size = 0; size < 13; size++) {
      this._board[size] = new Array(13);
    }
    for (let column = 0; column < 13; column++) {
      for (let line = 0; line < 13; line++) {
        this._board[column][line] = Color.NONE;
      }
    }
  }

  _undo_change_player() {
    if (this.cptwhite === 1) {
      this.cptwhite = 0;
      return;
    }
    if (this.cptwhite === 0) {
      this._color = Color.BLUE;
      this.cptwhite = -1;
      this.cptblue = 1;
      return;
    }
    if (this.cptblue === 0) {
      this._color = Color.WHITE;
      this.cptblue = -1;
      this.cptwhite = 1;
      return;
    }
    if (this.cptblue === 1) {
      this.cptblue = 0;
      return;
    }
  }

  _valid_move(column, line, color) {
    if (!this._case_in_grid(column, line)) {
      return false;
    }
    if (!this._free_case(column, line)) {
      return false;
    }
    if (!this._check_5(column, line, color)) {
      return false;
    }
    if (this._check_double_4(column, line, color) === 1) {
      return false;
    }
    return true;
  }

  _winning_piece(column, line, color) {

    for (let x = 0; x < 12; x++) {
      this._win_piece[x] = 0;
    }
    let tabz = new Array(6);
    for (let x = 0; x < 5; x++) {
      tabz[x] = 0;
    }
    tabz[0] = column;
    tabz[1] = line;
    while (tabz[0] - 1 > -1 && this._board[tabz[0] - 1][tabz[1]] === color) {
      tabz[0] = tabz[0] - 1;
      this._win_piece[1] = this._win_piece[1] + 1;
    }
    tabz[0] = column;
    while (tabz[0] + 1 < 13 && this._board[tabz[0] + 1][tabz[1]] === color) {
      tabz[0] = tabz[0] + 1;
      this._win_piece[2] = this._win_piece[2] + 1;
    }
    tabz[0] = column;
    tabz[1] = line;
    while (tabz[1] + 1 < 13 && this._board[tabz[0]][tabz[1] + 1] === color) {
      tabz[1] = tabz[1] + 1;
      this._win_piece[4] = this._win_piece[4] + 1;
    }
    tabz[1] = line;
    while (tabz[1] - 1 > -1 && this._board[tabz[0]][tabz[1] - 1] === color) {
      tabz[1] = tabz[1] - 1;
      this._win_piece[5] = this._win_piece[5] + 1;
    }
    tabz[0] = column;
    tabz[1] = line;
    while (tabz[0] - 1 > -1 && tabz[1] + 1 < 13 && this._board[tabz[0] - 1][tabz[1] + 1] === color) {
      tabz[0] = tabz[0] - 1;
      tabz[1] = tabz[1] + 1;
      tabz[2] = tabz[2] + 1;
    }
    tabz[0] = column;
    tabz[1] = line;
    while (tabz[0] + 1 < 13 && tabz[1] - 1 > -1 && this._board[tabz[0] + 1][tabz[1] - 1] === color) {
      tabz[0] = tabz[0] + 1;
      tabz[1] = tabz[1] - 1;
      tabz[3] = tabz[3] + 1;
    }
    tabz[0] = column;
    tabz[1] = line;
    while (tabz[0] - 1 > -1 && tabz[1] - 1 > -1 && this._board[tabz[0] - 1][tabz[1] - 1] === color) {
      tabz[0] = tabz[0] - 1;
      tabz[1] = tabz[1] - 1;
      tabz[4] = tabz[4] + 1;
    }
    tabz[0] = column;
    tabz[1] = line;
    while (tabz[0] + 1 < 13 && tabz[1] + 1 < 13 && this._board[tabz[0] + 1][tabz[1] + 1] === color) {
      tabz[0] = tabz[0] + 1;
      tabz[1] = tabz[1] + 1;
      tabz[5] = tabz[5] + 1;
    }
    if (this._win_piece[1] + this._win_piece[2] === 3) {
      this._win_piece[0] = 1;
    }
    if (this._win_piece[4] + this._win_piece[5] === 3) {
      this._win_piece[3] = 1;
    }
    if (tabz[2] + tabz[3] === 3) {
      this._win_piece[6] = 1;
      this._win_piece[7] = tabz[2];
      this._win_piece[8] = tabz[3];
    }
    if (tabz[4] + tabz[5] === 3) {
      this._win_piece[9] = 1;
      this._win_piece[10] = tabz[4];
      this._win_piece[11] = tabz[5];
    }
    return;
  }

}

export default Engine;