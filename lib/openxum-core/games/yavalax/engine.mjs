// lib/openxum-core/games/yavalax/engine.mjs
"use strict";

import OpenXum from '../../openxum/engine.mjs';
//import les autres classes dont vous avez besoin

import Move from './move.mjs';
import Color from './color.mjs';

class Engine extends OpenXum.Engine {
    constructor(type) {
        super();

        this._color = Color.WHITE;
        this.cptwhite = 1;
        this.cptblue = -1;
        this._initialize_board();
        this._winner = false;
        this.color_winner = Color.NONE;
        this.last_column = 0;
        this.last_line = 0;

        this._win_piece = [];
    }

    apply_moves(moves) {
        // Permet d'appliquer une liste de coups.
        // Le paramètre moves contient un tableau d'objets Move.
    }

    clone() {
        let o = new Engine();
        let b = new Array(13);

        for (let size = 0; size < 13; size++) {
            b[size] = new Array(13);
        }

        for (let column = 0; column < 13; column++) {
            for (let line = 0; line < 13; line++) {
                if (this._board[column][line] !== undefined) {
                    b[column][line] = this._board[column][line].clone();
                }
            }
        }

        o._set(this.cptwhite, this.cptblue, b, this._winner, this.color_winner,
            this.last_column, this.last_line, this._win_piece);
    }

    _set(cw, cb, b, w, col, lc, ll) {
        this.cptwhite = cw;
        this.cptblue = cb;
        this._board = b;
        this._winner = w;
        this.color_winner = col;
        this.last_column = lc;
        this.last_line = ll;

        this._win_piece = [];
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
                else {
                    //   console.log("on ne push pas en"+ca+","+cb);
                }
            }
        }
        return moves;
    }


    is_finished() {
        if (this._winner) {
            if (this.color_winner === Color.WHITE) {
                $('#winnerBodyText').html('<h4>The winner is WHITE' + '!</h4>');
                $("#winnerModal").modal("show");
            }
            else {
                $('#winnerBodyText').html('<h4>The winner is BLUE ' + '!</h4>');
                $("#winnerModal").modal("show");
            }
            return true;
        }
    }

    move(move) {
        this._board[move.column()][move.line()] = move.color();
        this.last_column = move.column();
        this.last_line = move.line();

        this._actualise_winner(move.column(), move.line(), move.color());
        if (this._winner) {
            this._winning_piece(move.column(), move.line(), move.color());
            this.color_winner = move.color();
        }
        this._change_player();
        return true;
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
        return this.color_winner;
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

        if (this._board[5][5] === Color.WHITE) {
            //console.log("c bon");
        }
        else {
            //console.log("bugg");
        }

        for (let column = 0; column < 13; column++) {
            for (let line = 0; line < 13; line++) {

                this._free_case(column, line);
            }
        }
    }

    _valid_move(column, line, color) {
        if (this._case_in_grid(column, line) === false) {
            console.log("case non dans grille");
            return false;
        }

        if (this._free_case(column, line) === false) {
            console.log("case non libre");
            return false;
        }
        //console.log("case libre");

        if (!this._check_5(column, line, color)) {
            return false;
        }

        let _compteur_connect4 = this._check_double_4(column, line, color);

        if (_compteur_connect4 === 1) {
            console.log("simple 4 de suite, coup invalide");
            return false;
        }
        return true;
    }

    _actualise_winner(column, line, color) {
        let _compteur_connect42 = this._check_double_4(column, line, color);

        if (_compteur_connect42 > 1) {
            console.log("coup victorieux");
            this._winner = true;
        }
    }

    _change_player() {
        if (this.cptwhite === 1) {
            this._color = Color.BLUE;
            this.cptwhite = -1;
            this.cptblue = 0;
            console.log("changement de blanc à bleu");
            return;
        }

        if (this.cptwhite === 0) {
            this.cptwhite = 1;
            console.log("on reste à blanc");
            return;
        }

        if (this.cptblue === 0) {
            this.cptblue = 1;
            console.log("on reste à bleu");
            return;
        }

        if (this.cptblue === 1) {
            this._color = Color.WHITE;
            this.cptblue = -1;
            this.cptwhite = 0;
            console.log("changement de bleu à blanc");
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
            //console.log("C'est NONE");
            return true;
        }
        else {
            if (this._board[column][line] === Color.WHITE) {
                console.log("C'est WHITE");

            }
            if (this._board[column][line] === Color.BLUE) {
                console.log("C'est BLUE");

            }
            //console.log("C'est coloré");
            return false;
        }
    }


    _check_5(column, line, color) {
        //console.log(this._board[2][1]);
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
            console.log("ligne de 5 : coup invalide");
            return false;
        }

        ptx = column;
        pty = line;


        while (pty + 1 < 13 && this._board[ptx][pty + 1] === color) {
            pty = pty + 1;
            up_down = up_down + 1;
            //console.log("haut")
            //console.log(up_down);
        }

        pty = line;

        while (this._case_in_grid(ptx, pty - 1) && this._board[ptx][pty - 1] === color) {
            pty = pty - 1;
            up_down = up_down + 1;
            //console.log("bas")
            //console.log(up_down);
        }

        if (up_down > 3) {
            console.log("colonne de 5 : coup invalide");
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
            console.log("diago de hautgauche à bas droite de 5");
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
            console.log("diago de basgauche vers hautdroit de 5");
            return false;
        }
        //console.log("ne fait pas une suite de 5");
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
        $('#winnerBodyText').html('<h4>Aucun coup possible ! égalité !' + '!</h4>');
        $("#winnerModal").modal("show");
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

export default Engine