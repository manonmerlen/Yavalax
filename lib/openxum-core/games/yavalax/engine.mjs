// lib/openxum-core/games/yavalax/engine.mjs
"use strict";

import OpenXum from '../../openxum/engine.mjs';
//import les autres classes dont vous avez besoin

import Coordinates from './coordinates.mjs';
import Move from './move.mjs';
import Color from './color.mjs';
import Intersection from './intersection.mjs';
import Piece from './piece.mjs';

class Engine extends OpenXum.Engine {
    constructor(type) {
        super();
        // Déclaration de tous les attributs nécessaires

        this._color = Color.WHITE;
        this.cptwhite = 1; //compteur de coup; on commence à 1 pour blanc
        this.cptblue = -1;
        this._initialize_board();
        this._winner = false;

        this._win_piece = [];

        // this._intersections = [];
    }

    apply_moves(moves) {
        // Permet d'appliquer une liste de coups.
        // Le paramètre moves contient un tableau d'objets Move.
    }

    clone() {
        // Permet de cloner le moteur de jeu.
        // Attention à bien dupliquer de tous les attributs.
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
        // Retourne la liste de tous les coups possibles
        // La liste retournée doit être un tableau d'objet Move.

        let moves = [];

        for (let ca = 0; ca < 13; ca++) {
            for (let cb = 0; cb < 13; cb++) {
                if (this._coup_valide(ca, cb, this.current_color())) { //source d'erreur en cas de victoire
                    moves.push(new Move(ca, cb));
                    //console.log("on push dans le tableau en"+ca+","+cb)
                }
                else {
                    //   console.log("on ne push pas en"+ca+","+cb);
                }
            }
        }
        return moves;
    }


    is_finished() {
        console.log("coucou");
        // Retourne si la partie est terminée ou non.
        //pas officiel
        if (this._winner) {
            if (this.current_color() === Color.WHITE) {
                $('#winnerBodyText').html('<h4>The winner is WHITE' + '!</h4>');
                $("#winnerModal").modal("show");


            }
            else {
                $('#winnerBodyText').html('<h4>The winner is BLUE ' + '!</h4>');
                $("#winnerModal").modal("show");
            }
            //this._winner = false;
            return true;
        }
    }

    move(move) {
        // Permet d'appliquer un coup et mets à jour l'état du jeu.

        this._board[move.colonne()][move.ligne()] = move.color();
        // this._board[this.move().colonne()][this.move().ligne()] = this.current_color();
        this._changerJoueur();
        this._actualise_winner(move.colonne(),move.ligne(),move.color());

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
        // return this._current_color;
        // Indique le joueur qui a gagné.
        return this._current_color;
    }


    _initialize_board() {
        this._board = new Array(13);

        for (let i = 0; i < 13; i++) {
            this._board[i] = new Array(13);
        }
        //   this._king = new Piece(Color.WHITE, true, new Coordinates(5, 5));
        //      this._board[5][5] = this._king;


//       initialisation du tableau
        for (let gh = 0; gh < 13; gh++) {
            for (let gz = 0; gz < 13; gz++) {
                this._board[gh][gz] = Color.NONE;

            }
        }


        //     this._board[5][5] = Color.WHITE;

        if (this._board[5][5] === Color.WHITE) {
            console.log("c bon");
        }
        else {
            console.log("bugg");
        }


        for (let gp = 0; gp < 13; gp++) {
            for (let gm = 0; gm < 13; gm++) {

                this._case_libre(gp, gm);
            }
        }


        //   this._board[0][0] = Color.WHITE;
        //   this._board[1][1] = Color.WHITE;
        //   this._board[3][3] = Color.WHITE;
        //  this._coup_valide(2, 2, this.current_color());
        //  this._board[1][3] = Color.WHITE;
        //   this._board[3][1] = Color.WHITE;
        //  this._board[4][0] = Color.WHITE;


        //  this._coup_valide(2, 2, this.current_color());
        // let u =this.get_possible_move_list();
    }

    _coup_valide(x, y, c) {


        if (this._case_dans_grille(x, y) === false) {
            console.log("case non dans grille");
            return false;
        }


        if (this._case_libre(x, y) === false) {
            console.log("case non libre");
            return false;
        }
        console.log("case libre");

        if (!this._check_5(x, y, c)) {
            return false;
        }


        let _compteur_connect4 = this._check_double_4(x, y, c);

        if (_compteur_connect4 === 1) {
            console.log("simple 4 de suite, coup invalide");
            return false;
        }


        return true;
    }

    _actualise_winner(x, y, c) {
        let _compteur_connect42 = this._check_double_4(x, y, c);

        if (_compteur_connect42 > 1) {
            console.log("coup victorieux");

            this._winner = true;

        }
    }

    _changerJoueur() {

        if (this.cptwhite === 1) //source de problèmes
        {
            this._color = Color.BLUE;
            this.cptwhite = -1;
            this.cptblue = 0;
            console.log("changement de blanc à bleu");
            return;
        }

        if (this.cptwhite === 0) {
            //  this._color = Color.WHITE;
            this.cptwhite = 1;
            console.log("on reste à blanc");
            return;
        }

        if (this.cptblue === 0) {
            //   this._color = Color.BLUE;
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


    _case_dans_grille(x, y) {
        if (x < 0 || x > 12 || y < 0 || y > 12) {
            return false;
        }
        return true;
    }


    _case_libre(x, y) {
        //indique si la case est libre ou non
        if (this._board[x][y] === Color.NONE) {
            console.log("C'est NONE");
            return true;
        }
        else {
            if (this._board[x][y] === Color.WHITE) {
                console.log("C'est WHITE");

            }
            if (this._board[x][y] === Color.BLUE) {
                console.log("C'est BLUE");

            }
            console.log("C'est coloré");
            return false;
        }

    }


    _check_5(x, y, c) {

        console.log(this._board[2][1]);
        //indique si il y a 5 jetons de suite de la même couleur
        //prend en paramètres les coords du potentiel coup, ainsi que sa couleur

        let gd = 0;   //compteur de la ligne :gauche à droite
        let hb = 0;   //compteur de la colonne :haut en bas
        let hgbd = 0; //compteur de la diago :haut à gauche et bas à droite
        let bghd = 0; //compteur de la diago :de bas à droite et haut à gauche

        let ptx = x;  //pointeur pour parcourir la grille
        let pty = y;

        //check en ligne

        while (ptx - 1 > -1 && this._board[ptx - 1][pty] === c) {
            ptx = ptx - 1;
            gd = gd + 1;


        }
        ptx = x;
        while (ptx + 1 < 13 && this._board[ptx + 1][pty] === c) {
            ptx = ptx + 1;
            gd = gd + 1;
        }

        if (gd > 3) {
            console.log("ligne de 5 : coup invalide");
            return false;
        }

        ptx = x; //on reset les pointeurs
        pty = y;

        //check en colonne

        while (pty + 1 < 13 && this._board[ptx][pty + 1] === c) {
            pty = pty + 1;
            hb = hb + 1;

            console.log("haut")
            console.log(hb);
        }

        pty = y;

        while (this._case_dans_grille(ptx, pty - 1) && this._board[ptx][pty - 1] === c) {
            pty = pty - 1;
            hb = hb + 1;

            console.log("bas")
            console.log(hb);
        }

        if (hb > 3) {
            console.log("colonne de 5 : coup invalide");
            return false;
        }

        //check de haut à gauche vers bas à droite

        ptx = x; //on reset les pointeurs
        pty = y;

        while (ptx - 1 > -1 && pty + 1 < 13 && this._board[ptx - 1][pty + 1] === c) {
            ptx = ptx - 1;
            pty = pty + 1;
            hgbd = hgbd + 1;
        }
        ptx = x; //on reset les pointeurs
        pty = y;
        while (ptx + 1 < 13 && pty - 1 > -1 && this._board[ptx + 1][pty - 1] === c) {
            ptx = ptx + 1;
            pty = pty - 1;
            hgbd = hgbd + 1;
        }

        if (hgbd > 3) {
            console.log("diago de hautgauche à bas droite de 5");
            return false;
        }

        ptx = x; //on reset les pointeur
        pty = y;

        while (ptx - 1 > -1 && pty - 1 > -1 && this._board[ptx - 1][pty - 1] === c) {
            ptx = ptx - 1;
            pty = pty - 1;
            bghd = bghd + 1;
        }
        ptx = x; //on reset les pointeurs
        pty = y;
        while (ptx + 1 < 13 && pty + 1 < 13 && this._board[ptx + 1][pty + 1] === c) {
            ptx = ptx + 1;
            pty = pty + 1;
            bghd = bghd + 1;
        }

        if (bghd > 3) {
            console.log("diago de basgauche vers hautdroit de 5");
            return false;
        }

        console.log("ne fait pas une suite de 5");
        return true;
    }


    _check_double_4(x, y, c) {

        //indique si le coup potentiel va déclencher la victoire
        //prend en paramètres les coords du potentiel coup, ainsi que sa couleur

        let gd = 0;   //compteur de la ligne :gauche à droite
        let hb = 0;   //compteur de la colonne :haut en bas
        let hgbd = 0; //compteur de la diago :haut à gauche et bas à droite
        let bghd = 0; //compteur de la diago :de bas à droite et haut à gauche

        let ptx = x;  //pointeur pour parcourir la grille
        let pty = y;

        //check en ligne

        while (ptx - 1 > -1 && this._board[ptx - 1][pty] === c) {
            ptx = ptx - 1;
            gd = gd + 1;
        }
        ptx = x;
        while (ptx + 1 < 13 && this._board[ptx + 1][pty] === c) {
            ptx = ptx + 1;
            gd = gd + 1;
        }

        ptx = x; //on reset les pointeurs
        pty = y;

        //check en colonne

        while (pty + 1 < 13 && this._board[ptx][pty + 1] === c) {
            pty = pty + 1;
            hb = hb + 1;
        }
        pty = y;
        while (pty - 1 > -1 && this._board[ptx][pty - 1] === c) {
            pty = pty - 1;
            hb = hb + 1;
        }

        //check de haut à gauche vers bas à droite

        ptx = x; //on reset les pointeurs
        pty = y;

        while (ptx - 1 > -1 && pty + 1 < 13 && this._board[ptx - 1][pty + 1] === c) {
            ptx = ptx - 1;
            pty = pty + 1;
            hgbd = hgbd + 1;
        }
        ptx = x;
        pty = y;
        while (ptx + 1 < 13 && pty - 1 > -1 && this._board[ptx + 1][pty - 1] === c) {
            ptx = ptx + 1;
            pty = pty - 1;
            hgbd = hgbd + 1;
        }

        ptx = x; //on reset les pointeur
        pty = y;

        while (ptx - 1 > -1 && pty - 1 > -1 && this._board[ptx - 1][pty - 1] === c) {
            ptx = ptx - 1;
            pty = pty - 1;
            bghd = bghd + 1;
        }
        ptx = x;
        pty = y;
        while (ptx + 1 < 13 && pty + 1 < 13 && this._board[ptx + 1][pty + 1] === c) {
            ptx = ptx + 1;
            pty = pty + 1;
            bghd = bghd + 1;
        }

        let _compteur_victoire_potentiel = 0;

        if (gd === 3) {
            _compteur_victoire_potentiel = _compteur_victoire_potentiel + 1;
        }
        if (hb === 3) {
            _compteur_victoire_potentiel = _compteur_victoire_potentiel + 1;
        }
        if (hgbd === 3) {
            _compteur_victoire_potentiel = _compteur_victoire_potentiel + 1;
        }
        if (bghd === 3) {
            _compteur_victoire_potentiel = _compteur_victoire_potentiel + 1;
        }




        return _compteur_victoire_potentiel;
    }


    _check_full() {
        //check si le tableau est complet = égalité
        for (let ik = 0; ik < 13; ik++) {
            for (let il = 0; il < 13; il++) {
                if (this._coup_valide(ik, il, this.current_color())) {

                    return false;
                }

            }
        }
        //full
        $('#winnerBodyText').html('<h4>Aucun coup possible ! égalité !' + '!</h4>');
        $("#winnerModal").modal("show");
        return true;
    }

    _pieces_gagnantes(x,y,c)
    {
        //retourne un tableau [0] = 0,1,2,3 selon la victoire en gd , hb, hgbd, bghd [1] = nombre de pièce : soit à gauche soit en haut soit en haut à gauche soit en bas à gauche
        // [2]  = nombre de pièce : soit en bas soit à droite soit en bas à droite soit en haut à droite [3] = comme le [0]; [4]et [5] comme [2] et [3]

        let g = 0;
        let d = 0;
        let h = 0;
        let b = 0;
        let hg = 0;
        let bd = 0;
        let bg = 0;
        let hd = 0;

        let ptx = x;  //pointeur pour parcourir la grille
        let pty = y;
        //check en ligne

        while (ptx - 1 > -1 && this._board[ptx - 1][pty] === c) {
            ptx = ptx - 1;
            g = g + 1;
        }
        ptx = x;
        while (ptx + 1 < 13 && this._board[ptx + 1][pty] === c) {
            ptx = ptx + 1;
            d = d + 1;
        }
        ptx = x; //on reset les pointeurs
        pty = y;


        //check en colonne

        while (pty + 1 < 13 && this._board[ptx][pty + 1] === c) {
            pty = pty + 1;
            h = h + 1;
        }
        pty = y;
        while (pty - 1 > -1 && this._board[ptx][pty - 1] === c) {
            pty = pty - 1;
            b = b + 1;
        }


        //check de haut à gauche vers bas à droite

        ptx = x; //on reset les pointeurs
        pty = y;

        while (ptx - 1 > -1 && pty + 1 < 13 && this._board[ptx - 1][pty + 1] === c) {
            ptx = ptx - 1;
            pty = pty + 1;
            hg = hg + 1;
        }
        ptx = x;
        pty = y;
        while (ptx + 1 < 13 && pty - 1 > -1 && this._board[ptx + 1][pty - 1] === c) {
            ptx = ptx + 1;
            pty = pty - 1;
            bd = bd + 1;
        }
        ptx = x; //on reset les pointeur
        pty = y;


        while (ptx - 1 > -1 && pty - 1 > -1 && this._board[ptx - 1][pty - 1] === c) {
            ptx = ptx - 1;
            pty = pty - 1;
            bg = bg + 1;
        }
        ptx = x;
        pty = y;
        while (ptx + 1 < 13 && pty + 1 < 13 && this._board[ptx + 1][pty + 1] === c) {
            ptx = ptx + 1;
            pty = pty + 1;
            hd = hd + 1;
        }

        for(let x=0;x<12;x++)
        {
            this._win_piece[x] = 0;
        }





        if(g+d === 3)
        {
            this._win_piece[0] = 1;
            this._win_piece[1]=g;
            this._win_piece[2]=d;
        }

        if(h+b === 3)
        {
            this._win_piece[3]=1;
            this._win_piece[4]=h;
            this._win_piece[5]=b;
        }

        if(hg+ bd === 3)
        {
            this._win_piece[6]=1;
            this._win_piece[7]=hg;
            this._win_piece[8]=bd;
        }

        if(bg+hd === 3)
        {
            this._win_piece[9]=1;
            this._win_piece[10]=bg;
            this._win_piece[11]=hd;
        }
    return;
    }


}

export default Engine