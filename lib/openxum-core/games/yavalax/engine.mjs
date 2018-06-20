// lib/openxum-core/games/yavalax/engine.mjs
"use strict";

import OpenXum from '../../openxum/engine.mjs';
//import les autres classes dont vous avez besoin


import Move from './move.mjs';
import Color from './color.mjs';

class Engine extends OpenXum.Engine {
  constructor(t, c) {
    super();
    // Déclaration de tous les attributs nécessaires

    this._type = t;
    this._color = c;
    this.cptwhite = 1; //compteur de coup; on commence à 1 pour blanc
    this.cptblue = -1;
    this._initialize_board();
    this._winner = false;
    this.color_winner = Color.NONE;
    this.last_column = 0;
    this.last_line = 0;
    this._win_piece = [];
    this.equality = false;
    this._previous_player = Color.NONE;

    // this._intersections = [];
  }

  apply_moves(moves) {
    // Permet d'appliquer une liste de coups.
    // Le paramètre moves contient un tableau d'objets Move.
  }

  clone() {
    // Permet de cloner le moteur de jeu.
    // Attention à bien dupliquer de tous les attributs.

    let o = new Engine(this._type, this._color);


    for (let x = 0; x < 13; x++) {
      for (let y = 0; y < 13; y++) {
        if (this._board[x][y] !== undefined) {
          o._board[x][y] = this._board[x][y];
        }
      }
    }

    //   o._color = this._color;
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
    // Retourne le joueur en train de jouer.
    return this._color;
  }

  alt_color() {
    // Retourne l'ancien joueur
    if (this._color === Color.WHITE) {
      return Color.BLUE;
    }
    return Color.WHITE;
  }


  get_name() {
    // Retourne le nom du jeu.
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

    if (this._winner) {

      return true;
    }
    return false;
  }

  move(move) {
    // Permet d'appliquer un coup et mets à jour l'état du jeu.
    this._board[move.column()][move.line()] = move.color();
    // this._board[this.move().colonne()][this.move().ligne()] = this.current_color();
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
    //!!!!!!!on doit vérifier si le prochain joueur a des coups disponible, et si non, mettre _winner à false
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
    // Modifier l'état du jeu en fonction de l'état passé sous forme d'une
    // chaîne de caractères
  }

  to_string() {
    // Construit une représentation sous forme d'une chaîne de caractères
    // de l'état du jeu
  }

  winner_is() {
    // return this._current_color;
    // Indique le joueur qui a gagné.
    return this.color_winner;
  }


  _initialize_board() {
    this._board = new Array(13);

    for (let size = 0; size < 13; size++) {
      this._board[size] = new Array(13);
    }

//       initialisation du tableau
    for (let column = 0; column < 13; column++) {
      for (let line = 0; line < 13; line++) {
        this._board[column][line] = Color.NONE;
      }
    }


    if (this._board[5][5] === Color.WHITE) {
      //     console.log("c bon");
    }
    else {
      //      console.log("bugg");
    }


    for (let column = 0; column < 13; column++) {
      for (let line = 0; line < 13; line++) {

        this._free_case(column, line);
      }
    }
  }

  _valid_move(column, line, color) {

    if (this._case_in_grid(column, line) === false) {
      //        console.log("case non dans grille");
      return false;
    }

    if (this._free_case(column, line) === false) {
      //        console.log("case non libre");
      return false;
    }
    //      console.log("case libre");

    if (!this._check_5(column, line, color)) {
      return false;
    }

    let _compteur_connect4 = this._check_double_4(column, line, color);

    if (_compteur_connect4 === 1) {
      //      console.log("simple 4 de suite, coup invalide");
      return false;
    }
    return true;
  }

  _actualise_winner(column, line, color) {
    let _compteur_connect42 = this._check_double_4(column, line, color);

    if (_compteur_connect42 > 1) {
      //  console.log("coup victorieux");

      this._winner = true;

    }
    if (this.get_possible_move_list().length === 0) {
      this._winner = true;
      this.equality = true;
    }
    return false;
  }

  _change_player() {
    if (this.cptwhite === 1) {
      this._color = Color.BLUE;
      this.cptwhite = -1;
      this.cptblue = 0;
      //       console.log("changement de blanc à bleu");
      return;
    }

    if (this.cptwhite === 0) {
      this.cptwhite = 1;
      //       console.log("on reste à blanc");
      return;
    }

    if (this.cptblue === 0) {
      this.cptblue = 1;
      //       console.log("on reste à bleu");
      return;
    }

    if (this.cptblue === 1) {
      this._color = Color.WHITE;
      this.cptblue = -1;
      this.cptwhite = 0;
      //        console.log("changement de bleu à blanc");
      return;
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


  _case_in_grid(column, line) {
    if (column < 0 || column > 12 || line < 0 || line > 12) {
      return false;
    }
    return true;
  }


  _free_case(column, line) {
    if (this._board[column][line] === Color.NONE) {
      //        console.log("C'est NONE");
      return true;
    }
    else {
      if (this._board[column][line] === Color.WHITE) {
        //         console.log("C'est WHITE");

      }
      if (this._board[column][line] === Color.BLUE) {
        //            console.log("C'est BLUE");

      }
      //         console.log("C'est coloré");
      return false;
    }
  }


  _check_5(column, line, color) {
    //   console.log(this._board[2][1]);

    let left_right = 0;
    let up_down = 0;
    let leftUp_rightDown = 0;
    let leftDown_rightUp = 0;

    let ptx = column;
    let pty = line;

    while (ptx - 1 > -1 && this._board[ptx - 1][pty] === color) {
      ptx = ptx - 1;
      left_right = left_right + 1;
    }

    ptx = column;
    while (ptx + 1 < 13 && this._board[ptx + 1][pty] === color) {
      ptx = ptx + 1;
      left_right = left_right + 1;
    }

    if (left_right > 3) {
      //      console.log("ligne de 5 : coup invalide");
      return false;
    }

    ptx = column;
    pty = line;


    while (pty + 1 < 13 && this._board[ptx][pty + 1] === color) {
      pty = pty + 1;
      up_down = up_down + 1;

      //    console.log("haut")
      //    console.log(up_down);
    }

    pty = line;

    while (this._case_in_grid(ptx, pty - 1) && this._board[ptx][pty - 1] === color) {
      pty = pty - 1;
      up_down = up_down + 1;

      //   console.log("bas")
      //     console.log(up_down);
    }

    if (up_down > 3) {
      //    console.log("colonne de 5 : coup invalide");
      return false;
    }

    ptx = column;
    pty = line;

    while (ptx - 1 > -1 && pty + 1 < 13 && this._board[ptx - 1][pty + 1] === color) {
      ptx = ptx - 1;
      pty = pty + 1;
      leftUp_rightDown = leftUp_rightDown + 1;
    }
    ptx = column;
    pty = line;
    while (ptx + 1 < 13 && pty - 1 > -1 && this._board[ptx + 1][pty - 1] === color) {
      ptx = ptx + 1;
      pty = pty - 1;
      leftUp_rightDown = leftUp_rightDown + 1;
    }

    if (leftUp_rightDown > 3) {
      //  console.log("diago de hautgauche à bas droite de 5");
      return false;
    }

    ptx = column;
    pty = line;

    while (ptx - 1 > -1 && pty - 1 > -1 && this._board[ptx - 1][pty - 1] === color) {
      ptx = ptx - 1;
      pty = pty - 1;
      leftDown_rightUp = leftDown_rightUp + 1;
    }
    ptx = column;
    pty = line;
    while (ptx + 1 < 13 && pty + 1 < 13 && this._board[ptx + 1][pty + 1] === color) {
      ptx = ptx + 1;
      pty = pty + 1;
      leftDown_rightUp = leftDown_rightUp + 1;
    }

    if (leftDown_rightUp > 3) {
      //   console.log("diago de basgauche vers hautdroit de 5");
      return false;
    }

    // console.log("ne fait pas une suite de 5");
    return true;
  }


  _check_double_4(column, line, color) {

    let left_right = 0;
    let up_down = 0;
    let leftUp_rightDown = 0;
    let leftDown_rightUp = 0;

    let ptx = column;
    let pty = line;

    while (ptx - 1 > -1 && this._board[ptx - 1][pty] === color) {
      ptx = ptx - 1;
      left_right = left_right + 1;
    }
    ptx = column;
    while (ptx + 1 < 13 && this._board[ptx + 1][pty] === color) {
      ptx = ptx + 1;
      left_right = left_right + 1;
    }

    ptx = column;
    pty = line;


    while (pty + 1 < 13 && this._board[ptx][pty + 1] === color) {
      pty = pty + 1;
      up_down = up_down + 1;
    }
    pty = line;
    while (pty - 1 > -1 && this._board[ptx][pty - 1] === color) {
      pty = pty - 1;
      up_down = up_down + 1;
    }


    ptx = column;
    pty = line;

    while (ptx - 1 > -1 && pty + 1 < 13 && this._board[ptx - 1][pty + 1] === color) {
      ptx = ptx - 1;
      pty = pty + 1;
      leftUp_rightDown = leftUp_rightDown + 1;
    }
    ptx = column;
    pty = line;
    while (ptx + 1 < 13 && pty - 1 > -1 && this._board[ptx + 1][pty - 1] === color) {
      ptx = ptx + 1;
      pty = pty - 1;
      leftUp_rightDown = leftUp_rightDown + 1;
    }

    ptx = column;
    pty = line;

    while (ptx - 1 > -1 && pty - 1 > -1 && this._board[ptx - 1][pty - 1] === color) {
      ptx = ptx - 1;
      pty = pty - 1;
      leftDown_rightUp = leftDown_rightUp + 1;
    }
    ptx = column;
    pty = line;
    while (ptx + 1 < 13 && pty + 1 < 13 && this._board[ptx + 1][pty + 1] === color) {
      ptx = ptx + 1;
      pty = pty + 1;
      leftDown_rightUp = leftDown_rightUp + 1;
    }

    let _potential_victory_cpt = 0;

    if (left_right === 3) {
      _potential_victory_cpt = _potential_victory_cpt + 1;
    }
    if (up_down === 3) {
      _potential_victory_cpt = _potential_victory_cpt + 1;
    }
    if (leftUp_rightDown === 3) {
      _potential_victory_cpt = _potential_victory_cpt + 1;
    }
    if (leftDown_rightUp === 3) {
      _potential_victory_cpt = _potential_victory_cpt + 1;
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
    //full
    /*
     $('#winnerBodyText').html('<h4>Aucun coup possible ! égalité !' + '!</h4>');
     $("#winnerModal").modal("show");
     */
    return true;
  }

  _winning_piece(column, line, color) {
    let left = 0;
    let right = 0;
    let up = 0;
    let down = 0;
    let left_up = 0;
    let right_down = 0;
    let left_down = 0;
    let right_up = 0;

    let ptx = column;
    let pty = line;

    while (ptx - 1 > -1 && this._board[ptx - 1][pty] === color) {
      ptx = ptx - 1;
      left = left + 1;
    }
    ptx = column;
    while (ptx + 1 < 13 && this._board[ptx + 1][pty] === color) {
      ptx = ptx + 1;
      right = right + 1;
    }
    ptx = column;
    pty = line;


    while (pty + 1 < 13 && this._board[ptx][pty + 1] === color) {
      pty = pty + 1;
      up = up + 1;
    }
    pty = line;
    while (pty - 1 > -1 && this._board[ptx][pty - 1] === color) {
      pty = pty - 1;
      down = down + 1;
    }


    ptx = column;
    pty = line;

    while (ptx - 1 > -1 && pty + 1 < 13 && this._board[ptx - 1][pty + 1] === color) {
      ptx = ptx - 1;
      pty = pty + 1;
      left_up = left_up + 1;
    }
    ptx = column;
    pty = line;
    while (ptx + 1 < 13 && pty - 1 > -1 && this._board[ptx + 1][pty - 1] === color) {
      ptx = ptx + 1;
      pty = pty - 1;
      right_down = right_down + 1;
    }
    ptx = column;
    pty = line;


    while (ptx - 1 > -1 && pty - 1 > -1 && this._board[ptx - 1][pty - 1] === color) {
      ptx = ptx - 1;
      pty = pty - 1;
      left_down = left_down + 1;
    }
    ptx = column;
    pty = line;
    while (ptx + 1 < 13 && pty + 1 < 13 && this._board[ptx + 1][pty + 1] === color) {
      ptx = ptx + 1;
      pty = pty + 1;
      right_up = right_up + 1;
    }

    for (let x = 0; x < 12; x++) {
      this._win_piece[x] = 0;
    }

    if (left + right === 3) {
      this._win_piece[0] = 1;
      this._win_piece[1] = left;
      this._win_piece[2] = right;
    }

    if (up + down === 3) {
      this._win_piece[3] = 1;
      this._win_piece[4] = up;
      this._win_piece[5] = down;
    }

    if (left_up + right_down === 3) {
      this._win_piece[6] = 1;
      this._win_piece[7] = left_up;
      this._win_piece[8] = right_down;
    }

    if (left_down + right_up === 3) {
      this._win_piece[9] = 1;
      this._win_piece[10] = left_down;
      this._win_piece[11] = right_up;
    }
    return;
  }

}

export default Engine;