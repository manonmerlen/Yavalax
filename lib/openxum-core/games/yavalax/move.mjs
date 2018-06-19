"use strict";

import Color from './color.mjs';

class Move {
    constructor(x, y, c) {
    	this._column = x;
        this._line = y;
        this._color = c;
    }

// public methods
   column() {
        return this._column;
    }

    line() {
        return this._line;
    }

    color() {
     return this._color;
     }

    get() {
       // return this._column.to_string() + this._line.to_string() + this._color.toString();
        return this._column + (this._color === Color.WHITE ? 'W' : 'B')+ this._line ;
    }

    parse(str) {
        // permet de set la source et la destination à partir d'une chaîne.
        this._column = str.charAt(0);
        this._line = str.charAt(2);
        this._color = str.charAt(1) === 'W' ? Color.WHITE : Color.BLUE;
        console.log(str);
    }

    to_object() {
        // Retourne les données de classe sous forme d'objet.
        // Cet objet est utilisé pour envoyer le move à un api rest
        // (rest_web_service_player)
        //return {from: this._column, to: this._line};
    }

    to_string() {
           // retourne le mouvement sous la forme d'une chaîne
         // cette méthode sert notamment lors de l'affichage de la
         // liste des mouvements quand on clique sur le bouton
         // "Move list" à partir de l'interface graphique.

         if (this.color() === Color.WHITE)
         {
         return 'Place WHITE piece in : ' + this._column + ' / ' + this._line;
         }
         return 'Place BLUE piece in : ' + this._column + ' / ' + this._line;
    }
}

export default Move;