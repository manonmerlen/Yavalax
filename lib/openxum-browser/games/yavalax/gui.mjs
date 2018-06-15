"use strict";

// lib/openxum-browser/games/yavalax/gui.mjs
import OpenXum from '../../openxum/gui.mjs';
import Yavalax from '../../../openxum-core/games/yavalax/index.mjs';
import Move from '../../../openxum-core/games/yavalax/move.mjs';

class Gui extends OpenXum.Gui {
    constructor(c, e, l, g) {
        super(c, e, l, g);
        this._deltaX = 0;
        this._deltaY = 0;
        this._offsetX = 0;
        this._offsetY = 0;
        this._move = undefined;

        this.cpwhite = 1; //compteur de coup; on commence à 1 pour blanc
        this.cpblue = 0;
        this._suivant = 0;
        this._suivant_suivant = 1;

        this.selected_cord = [];
    }

    //methodes publics
    draw() {
        console.log("appel draw")
        // background
        this._context.fillStyle = "#030303";
        this._round_rect(0, 0, this._canvas.width, this._canvas.height, 17, true, true);

        this._draw_grid();
        this._draw_state();
        //this._draw_couronne(2, 3);
    }

    get_move() {
        // Retourne le mouvement à effectuer par le manager pour le tour actuel
        // Un objet de type Move doit être construit ; si ce n'est pas le cas,
        // alors la méthode process_move sera invoquée





        let moo = new Yavalax.Move(this.selected_cord[0],this.selected_cord[1],this.engine().current_color());

        //this.engine()._changerJoueur();

        return moo;
    }

    is_animate() {
        return false;
    }

    is_remote() {
        return false;
    }

    move(move, color) {
        this._manager.play();
    }

    unselect() {
        // Remet à zéro tous les attributs relatifs au coup qui vient d'être joué
        //this._selected_color = Yavalax.Color.NONE;
    }

    set_canvas(c) {
        super.set_canvas(c);

        this._height = this._canvas.height;
        this._width = this._canvas.width;

        this._deltaX = (this._width * 0.95 - 30) / 13;
        this._deltaY = (this._height * 0.95 - 30) / 13;

        this._offsetX = this._width / 2 - this._deltaX * 6.5;
        this._offsetY = this._height / 2 - this._deltaY * 6.5;

        // Par exemple, pour intercepter les clics de la souris
        this._canvas.addEventListener("click", (e) => {
            this._on_click(e);
        });

        this.draw();
    }

    //methodes privees

    _draw_grid() {
        this._context.lineWidth = 1;
        this._context.strokeStyle = "#000000";
        this._context.fillStyle = "#C0C0C0";
        for (let i = 0; i < 13; ++i) {
            for (let j = 0; j < 13; ++j) {
                this._context.beginPath();
                this._context.moveTo(this._offsetX + i * this._deltaX, this._offsetY + j * this._deltaY);
                this._context.lineTo(this._offsetX + (i + 1) * this._deltaX - 2, this._offsetY + j * this._deltaY);
                this._context.lineTo(this._offsetX + (i + 1) * this._deltaX - 2, this._offsetY + (j + 1) * this._deltaY - 2);
                this._context.lineTo(this._offsetX + i * this._deltaX, this._offsetY + (j + 1) * this._deltaY - 2);
                this._context.moveTo(this._offsetX + i * this._deltaX, this._offsetY + j * this._deltaY);
                this._context.closePath();
                this._context.fill();
            }
        }

        this._draw_carre_1(this.engine().current_color());
        this._draw_carre_2(this.engine().alt_color());
        //this._draw_triangle();
    }

    _round_rect(x, y, width, height, radius, fill, stroke) {
        if (typeof stroke === "undefined") {
            stroke = true;
        }
        if (typeof radius === "undefined") {
            radius = 5;
        }
        this._context.beginPath();
        this._context.moveTo(x + radius, y);
        this._context.lineTo(x + width - radius, y);
        this._context.quadraticCurveTo(x + width, y, x + width, y + radius);
        this._context.lineTo(x + width, y + height - radius);
        this._context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this._context.lineTo(x + radius, y + height);
        this._context.quadraticCurveTo(x, y + height, x, y + height - radius);
        this._context.lineTo(x, y + radius);
        this._context.quadraticCurveTo(x, y, x + radius, y);
        this._context.closePath();
        if (stroke) {
            this._context.stroke();
        }
        if (fill) {
            this._context.fill();
        }

    }

    _draw_piece_colored(i, j, couleur) {
        let pt = this._convertion_pixel_case(i, j);
        if (couleur === 0) {
            this._context.fillStyle = "#FFFFFF";
        }
        if (couleur === 1) {
            this._context.fillStyle = "#1240F7";
        }
        this._context.beginPath();
        this._context.shadowOffsetX = 3;
        this._context.shadowOffsetY = 3;
        this._context.shadowBlur = 4;
        this._context.shadowColor = "rgba(0, 0, 0, 0.5)";
        this._context.arc(pt[0], pt[1], this._deltaX * (1.0 / 3 + 1.0 / 10), 0.0, 2 * Math.PI);
        this._context.closePath();
        this._context.fill();


        this._context.shadowOffsetX = 0;
        this._context.shadowOffsetY = 0;
        this._context.shadowBlur = 0;
        this._context.shadowColor = "rgba(0, 0, 0, 0)";

    }




    _convertion_pixel_case(i, j) {
        i = (i * this._deltaX+0.5) + this._offsetX+18;
        j = (j * this._deltaX-0.5) + this._offsetX+19;
        return [i, j];
    }

    _convertion_case_pixel(i, j) {
        i = (i - this._offsetX -4) / this._deltaX;
        j = (j - this._offsetY -3) / this._deltaY;
        return [i, j];
    }

    _get_click_position(e) {
        let rect = this._canvas.getBoundingClientRect();
        return {x: (e.clientX - rect.left) * this._scaleX, y: (e.clientY - rect.top) * this._scaleY};
    }

    _on_click(event) {

        console.log("OK");
        let pos = this._get_click_position(event);
        let c = this._convertion_case_pixel(pos.x + 5, pos.y + 5);

        if (!this._engine.is_finished()) {
            if (this.engine()._coup_valide(Math.trunc(c[0]), Math.trunc(c[1]), this.engine().current_color())) {
                this.selected_cord[0] = Math.trunc(c[0]);
                this.selected_cord[1] = Math.trunc(c[1]);





              /*  if (!this.engine()._check_full()) {
                    console.log("pas full");
                }
                else {
                    console.log("coup invalide");
                } */
                this._manager.play();
            } //
        }

    }






           // this.engine()._actualise_winner(Math.trunc(c[0]), Math.trunc(c[1]),this.engine().current_color());
           // this.engine().is_finished();

         //   if (this.engine()._winner) {
          //  this.engine()._pieces_gagnantes(Math.trunc(c[0]), Math.trunc(c[1]),this.engine().current_color());
          //  this._place_couronne(Math.trunc(c[0]), Math.trunc(c[1]),this.engine().current_color());
         //   }

        //    this.engine()._changerJoueur();

        //    this._changement_couleur();

           /* for (let i = 0; i < 13; i++) {
                for (let j = 0; j < 13; j++) {
                    if (this.engine()._case_libre(i, j) && (!this.engine()._check_5(i, j, this.engine().current_color()) || this.engine()._check_double_4(i, j, this.engine().current_color()) === 1)) {
                        this._context.strokeStyle = "#000000";
                        this._draw_croix_erreur(i, j);
                    }

                    else {
                        if (this.engine()._case_libre(i, j) && (this.engine()._check_5(i, j, this.engine().current_color()) || this.engine()._check_double_4(i, j, this.engine().current_color()) === 0 ||
                            this.engine()._check_double_4(i, j, this.engine().current_color()) > 1 ))
                        {
                            this._context.strokeStyle = "#C0C0C0";
                            this._clear_croix(i, j);

                        }
                    }

                }
            } */

          //  this._draw_carre_1(this._suivant);
          //  this._draw_carre_2(this._suivant_suivant);
    /*    }
        if (!this.engine()._check_full())
        {
            console.log("pas full");
        }
        else {
            console.log("coup invalide");
        }
    } */

    _draw_carre_1(couleur) {
        let pt = this._convertion_case_pixel(2, 3);
        if (couleur === 0) {
            this._context.fillStyle = "#FFFFFF";
        }
        if (couleur === 1) {
            this._context.fillStyle = "#1240F7";
        }
        this._context.beginPath();
        this._context.moveTo(this._offsetX + (pt[0] - 0.1) * this._deltaX +12,
            this._offsetY + (pt[1] - 0.1) * this._deltaY + 10);
        this._context.lineTo(this._offsetX + (pt[0] + 0.5) * this._deltaX + 10,
            this._offsetY + (pt[1] - 0.1) * this._deltaY + 10);
        this._context.lineTo(this._offsetX + (pt[0] + 0.5) * this._deltaX +10,
            this._offsetY + (pt[1] + 0.5) * this._deltaY + 8);
        this._context.lineTo(this._offsetX + (pt[0] - 0.1) * this._deltaX + 12,
            this._offsetY + (pt[1] + 0.5) * this._deltaY + 8);
        this._context.moveTo(this._offsetX + (pt[0] + 0.1) * this._deltaX +12,
            this._offsetY + (pt[1] + 0.1) * this._deltaY + 10);
        this._context.closePath();
        this._context.fill();
    }


    _draw_carre_2(couleur) {
        let pt = this._convertion_case_pixel(30, 3);
        if (couleur === 0) {
            this._context.fillStyle = "#FFFFFF";
        }
        if (couleur === 1) {
            this._context.fillStyle = "#1240F7";
        }
        this._context.beginPath();
        this._context.moveTo(this._offsetX + (pt[0] + 0.1) * this._deltaX + 4,
            this._offsetY + (pt[1] + 0.1) * this._deltaY + 7);
        this._context.lineTo(this._offsetX + (pt[0] + 0.5) * this._deltaX + 2,
            this._offsetY + (pt[1] + 0.1) * this._deltaY + 7);
        this._context.lineTo(this._offsetX + (pt[0] + 0.5) * this._deltaX + 2,
            this._offsetY + (pt[1] + 0.5) * this._deltaY + 5);
        this._context.lineTo(this._offsetX + (pt[0] + 0.1) * this._deltaX + 4,
            this._offsetY + (pt[1] + 0.5) * this._deltaY + 5);
        this._context.moveTo(this._offsetX + (pt[0] + 0.1) * this._deltaX + 4,
            this._offsetY + (pt[1] + 0.1) * this._deltaY + 7);
        this._context.closePath();
        this._context.fill();
    }


  /*  _clear_croix(i, j) {
        for(let a=0; a < 15; a++) {
            this._draw_croix_erreur(i, j);
        }
    }*/

    _changement_couleur() {
        if (this.cpwhite === 1) {
            this.cpwhite = -1;
            this.cpblue = 0;
            this._suivant = 1;
            this._suivant_suivant = 1;
            return;
        }
        if (this.cpwhite === 0) {
            this.cpwhite = 1;
            this._suivant = 0;
            this._suivant_suivant = 1;
            return;
        }
        if (this.cpblue === 0) {
            this.cpblue = 1;
            this._suivant = 1;
            this._suivant_suivant = 0;
            return;
        }
        if (this.cpblue === 1) {
            this.cpblue = -1;
            this.cpwhite = 0;
            this._suivant = 0;
            this._suivant_suivant = 0;
            return;
        }
    }

    _draw_croix_erreur(i, j) {
        this._context.beginPath();
        this._context.moveTo(this._offsetX + i * this._deltaX + 12,
            this._offsetY + j * this._deltaY + 12);
        this._context.lineTo(this._offsetX + (i + 0.7) * this._deltaX - 2,
            this._offsetY + (j + 0.7) * this._deltaY - 2);
        this._context.closePath();
        this._context.stroke();

        this._context.beginPath();
        this._context.moveTo(this._offsetX + i * this._deltaX + 12,
            this._offsetY + (j + 0.7) * this._deltaY - 2);
        this._context.lineTo(this._offsetX + (i + 0.7) * this._deltaX - 2,
            this._offsetY + j * this._deltaY + 12);
        this._context.closePath();
        this._context.stroke();
    }

    _draw_couronne(i, j){
        this._context.fillStyle = "#FFD700";
        let radius =  (this._deltaX /2.3);
        let pt = this._convertion_pixel_case(i, j);
        this._context.beginPath();
        this._context.moveTo(pt[0] - (radius * 0.4), pt[1] + (radius * 0.2));
        this._context.lineTo(pt[0] - (radius * 0.4), pt[1] - (radius * 0.4));
        this._context.lineTo(pt[0] - (radius * 0.2), pt[1] - (radius * 0.1));

        this._context.lineTo(pt[0], pt[1] - (radius * 0.4));

        this._context.lineTo(pt[0] + (radius * 0.2), pt[1] - (radius * 0.1));
        this._context.lineTo(pt[0] + (radius * 0.4), pt[1] - (radius * 0.4));
        this._context.lineTo(pt[0] + (radius * 0.4), pt[1] + (radius * 0.2));
        this._context.lineTo(pt[0] - (radius * 0.4), pt[1] + (radius * 0.2));

        this._context.closePath();
        this._context.stroke();
        this._context.fill();
    }

    _place_couronne(x,y,c)
    {
        this._draw_couronne(x, y);

        if(this.engine()._win_piece[0] === 1 )
        {
            for(let xx =1;xx <= this.engine()._win_piece[1]; xx++)
            {
                this._draw_couronne(x-xx, y);
            }
            for(let xx =1;xx <= this.engine()._win_piece[2]; xx++)
            {
                this._draw_couronne(x+xx, y);
            }
        }

        if(this.engine()._win_piece[3] === 1)
        {
            for(let xx =1;xx <= this.engine()._win_piece[4]; xx++)
            {
                this._draw_couronne(x, y+xx);
            }
            for(let xx =1;xx <= this.engine()._win_piece[5]; xx++)
            {
                this._draw_couronne(x, y-xx);
            }
        }

        if(this.engine()._win_piece[6] === 1)
        {
            for(let xx =1;xx <= this.engine()._win_piece[7]; xx++)
            {
                this._draw_couronne(x-xx, y+xx);
            }
            for(let xx =1;xx <= this.engine()._win_piece[8]; xx++)
            {
                this._draw_couronne(x+xx, y-xx);
            }
        }

        if(this.engine()._win_piece[9] === 1)
        {
            for(let xx =1;xx <= this.engine()._win_piece[10]; xx++)
            {
                this._draw_couronne(x-xx, y-xx);
            }
            for(let xx =1;xx <= this.engine()._win_piece[11]; xx++)
            {
                this._draw_couronne(x+xx, y+xx);
            }
        }

    }

    _draw_state()
    {

        for (let i = 0; i < 13; i++) {
            for (let j = 0; j < 13; j++) {

                if(this.engine()._board[i][j] === 0)
                {
                    this._draw_piece_colored(i,j, 0);
                }
                if(this.engine()._board[i][j] === 1)
                {
                    this._draw_piece_colored(i,j, 1);
                }
            }
        }



        if (this.engine()._winner) {
            this.engine()._pieces_gagnantes(this.selected_cord[0],this.selected_cord[1], this.engine().current_color());
            this._place_couronne(this.selected_cord[0],this.selected_cord[1], this.engine().current_color());
        }



        for (let i = 0; i < 13; i++) {
            for (let j = 0; j < 13; j++) {
                if (this.engine()._case_libre(i, j) && (!this.engine()._check_5(i, j, this.engine().current_color()) || this.engine()._check_double_4(i, j, this.engine().current_color()) === 1)) {
                    this._context.strokeStyle = "#000000";
                    this._draw_croix_erreur(i, j);
                }

               /* else {
                    if (this.engine()._case_libre(i, j) && (this.engine()._check_5(i, j, this.engine().current_color()) || this.engine()._check_double_4(i, j, this.engine().current_color()) === 0 ||
                        this.engine()._check_double_4(i, j, this.engine().current_color()) > 1 )) {
                        this._context.strokeStyle = "#C0C0C0";
                        this._clear_croix(i, j);


                    }
                }*/

            }
        }
        this._draw_carre_1(this._suivant);
        this._draw_carre_2(this._suivant_suivant);

        this._changement_couleur();


    }
}



export default {
    Gui: Gui
};