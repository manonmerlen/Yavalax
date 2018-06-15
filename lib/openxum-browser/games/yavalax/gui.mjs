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
        this._suivant_suivant = 0;
    }

    //methodes publics
    draw() {
        // background
        this._context.fillStyle = "#030303";
        this._round_rect(0, 0, this._canvas.width, this._canvas.height, 17, true, true);

        this._draw_grid();
    }

    get_move() {
        // Retourne le mouvement à effectuer par le manager pour le tour actuel
        // Un objet de type Move doit être construit ; si ce n'est pas le cas,
        // alors la méthode process_move sera invoquée
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
        this._context.fillStyle = "#FFCEF0";
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
        let pt = this._convertion_case_pixel(i, j);
        if (couleur === 0) {
            this._context.fillStyle = "#FFFFFF";
        }
        if (couleur === 1) {
            this._context.fillStyle = "#1240F7";
        }
        this._context.beginPath();
        this._context.arc(pt[0], pt[1], this._deltaX * (1.0 / 3 + 1.0 / 10), 0.0, 2 * Math.PI);
        this._context.closePath();
        this._context.fill();
    }

    _convertion_case_pixel(i, j) {
        i = (i * this._deltaX+0.5) + this._offsetX+16;
        j = (j * this._deltaX-0.5) + this._offsetX+17;
        return [i, j];
    }

    _convertion_pixel_case(i, j) {
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
        let c = this._convertion_pixel_case(pos.x +5, pos.y +5);
        console.log(c[0]);
        console.log(c[1]);

        if (this.engine()._coup_valide(Math.trunc(c[0]), Math.trunc(c[1]), this.engine().current_color())){

            this._move = new Move(Math.trunc(c[0]), Math.trunc(c[1]));
            this.engine().move(this._move);

            this._draw_piece_colored(Math.trunc(c[0]), Math.trunc(c[1]), this.engine().current_color());
            console.log(this.engine()._board[Math.trunc(c[0])][Math.trunc(c[1])]);

            this.engine().is_finished()

            this.engine()._changerJoueur();

            this._changement_couleur();

            for (let i = 0; i < 13; i++) {
                for (let j = 0; j < 13; j++) {
                    if (this.engine()._case_libre(i, j) && (!this.engine()._check_5(i, j, this.engine().current_color()) || this.engine()._check_double_4(i, j, this.engine().current_color()) === 1)) {
                        this._context.strokeStyle = "#000000";
                        this._draw_croix_erreur(i, j);
                    }

                    else {
                        if (this.engine()._case_libre(i, j) && (this.engine()._check_5(i, j, this.engine().current_color()) || this.engine()._check_double_4(i, j, this.engine().current_color()) === 0 ||
                        this.engine()._check_double_4(i, j, this.engine().current_color()) > 1 ))
                        {
                            this._context.strokeStyle = "#FFCEF0";
                            this._clear_croix(i, j);

                        }
                    }
                }
            }

            this._draw_carre_1(this._suivant);
            this._draw_carre_2(this._suivant_suivant);
        }
        else {
            console.log("coup invalide");
        }
    }

    _draw_carre_1(couleur) {
        let pt = this._convertion_pixel_case(2, 3);
        if (couleur === 0) {
            this._context.fillStyle = "#FFFFFF";
        }
        if (couleur === 1) {
            this._context.fillStyle = "#1240F7";
        }
        this._context.beginPath();
        this._context.moveTo(this._offsetX + (pt[0] - 0.1) * this._deltaX +13,
            this._offsetY + (pt[1] - 0.1) * this._deltaY + 10);
        this._context.lineTo(this._offsetX + (pt[0] + 0.5) * this._deltaX + 11,
            this._offsetY + (pt[1] - 0.1) * this._deltaY + 10);
        this._context.lineTo(this._offsetX + (pt[0] + 0.5) * this._deltaX + 11,
            this._offsetY + (pt[1] + 0.5) * this._deltaY + 8);
        this._context.lineTo(this._offsetX + (pt[0] - 0.1) * this._deltaX + 13,
            this._offsetY + (pt[1] + 0.5) * this._deltaY + 8);
        this._context.moveTo(this._offsetX + (pt[0] + 0.1) * this._deltaX +13,
            this._offsetY + (pt[1] + 0.1) * this._deltaY + 10);
        this._context.closePath();
        this._context.fill();
    }


    _draw_carre_2(couleur) {
        let pt = this._convertion_pixel_case(30, 3);
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


    _clear_croix(i, j) {
        for(let a=0; a < 15; a++) {
            this._draw_croix_erreur(i, j);
        }
    }

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
/*
    _draw_triangle() {
        this._context.fillStyle = "#778899";
        let pt = this._convertion_pixel_case(1, 6);

        this._context.beginPath();
        this._context.moveTo(this._offsetX + (pt[0] + 0.1) * this._deltaX,
            this._offsetY + (pt[1] - 0.25) * this._deltaY);
        this._context.lineTo(this._offsetX + (pt[0] + 0.3) * this._deltaX,
            this._offsetY + (pt[1]) * this._deltaY);
        this._context.lineTo(this._offsetX + (pt[0] + 0.5) * this._deltaX,
            this._offsetY + (pt[1] - 0.25) * this._deltaY);
        this._context.moveTo(this._offsetX + (pt[0] + 0.1) * this._deltaX,
            this._offsetY + (pt[1] - 0.25) * this._deltaY);
        this._context.closePath();
        this._context.fill();
    }*/

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

}

export default {
    Gui: Gui
};