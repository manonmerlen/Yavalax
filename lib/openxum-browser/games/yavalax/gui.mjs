"use strict";

// lib/openxum-browser/games/yavalax/gui.mjs
import OpenXum from '../../openxum/gui.mjs';
import Yavalax from '../../../openxum-core/games/yavalax/index.mjs';

class Gui extends OpenXum.Gui {
    constructor(c, e, l, g) {
        super(c, e, l, g);
        this._deltaX = 0;
        this._deltaY = 0;
        this._offsetX = 0;
        this._offsetY = 0;
    }

    //methodes publics
    draw() {
        // background
        this._context.fillStyle = "#030303";
        this._round_rect(0, 0, this._canvas.width, this._canvas.height, 17, true, true);

        this._draw_grid();
        //this._draw_piece_colored(10, 2, 1);
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
        this._canvas.addEventListener("click", (e) => { this._on_click(e); });

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

    _draw_piece_colored(i, j, couleur){
        let pt = this._convertion_case_pixel(i, j);
        if (couleur === 0){
            this._context.fillStyle = "#FFFFFF";
        }
        if (couleur === 1){
            this._context.fillStyle = "#1240F7";
        }
        this._context.beginPath();
        this._context.moveTo(pt[0]+(75/3), pt[1]+(40/3));
        this._context.bezierCurveTo(pt[0]+(75/3), pt[1]+(37/3), pt[0]+(70/3), pt[1]+(25/3), pt[0]+(50/3), pt[1]+(25/3));
        this._context.bezierCurveTo(pt[0]+(20/3), pt[1]+(25/3), pt[0]+(20/3), pt[1]+(62.5/3), pt[0]+(20/3), pt[1]+(62.5/3));
        this._context.bezierCurveTo(pt[0]+(20/3), pt[1]+(80/3), pt[0]+(40/3), pt[1]+(102/3), pt[0]+(75/3), pt[1]+(120/3));
        this._context.bezierCurveTo(pt[0]+(110/3), pt[1]+(102/3), pt[0]+(130/3), pt[1]+(80/3), pt[0]+(130/3), pt[1]+(62.5/3));
        this._context.bezierCurveTo(pt[0]+(130/3), pt[1]+(62.5/3), pt[0]+(130/3), pt[1]+(25/3), pt[0]+(100/3), pt[1]+(25/3));
        this._context.bezierCurveTo(pt[0]+(85/3), pt[1]+(25/3), pt[0]+(75/3), pt[1]+(37/3), pt[0]+(75/3), pt[1]+(40/3));
        this._context.fill();
    }

    _convertion_case_pixel(i, j){
        i = i*this._deltaX + this._offsetX-6;
        j = j*this._deltaX + this._offsetX-5;
        return [i, j];
    }

    _convertion_pixel_case(i, j){
        i =  (i-this._offsetX+6)/this._deltaX;
        j =  (j-this._offsetY+5)/this._deltaY;
        return [i, j];
    }

    _get_click_position(e) {
        let rect = this._canvas.getBoundingClientRect();
        return {x: (e.clientX - rect.left) * this._scaleX, y: (e.clientY - rect.top) * this._scaleY};
    }

    _on_click(event) {
        console.log("OK");
       // if (this._engine.current_color() === this._color || this._gui !== null) {
            let pos = this._get_click_position(event);
            let c = this._convertion_pixel_case(pos.x, pos.y);
        if (c[0] >= 0 && c[0] < 13 && c[1] >= 0 && c[1] < 13) {
            this._draw_piece_colored(Math.trunc(c[0]), Math.trunc(c[1]), 1);
        }
       // }
    }
}

export default {
    Gui: Gui
};