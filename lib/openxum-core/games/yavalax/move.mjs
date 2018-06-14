"use strict";

import Coordinates from './coordinates.mjs';

class Move {
    constructor(x, y) {
        this._colonne = x;
        this._ligne = y;
    }

// public methods
    colonne() {
        return this._colonne;
    }

    ligne() {
        return this._ligne;
    }

    get() {
        return this._colonne.to_string() + this._ligne.to_string();
    }

    parse(str) {
        // permet de set la source et la destination à partir d'une chaîne.
   //     this._colonne = new Coordinates(str.charAt(0), parseInt(str.charAt(1)));
   //     this._ligne = new Coordinates(str.charAt(2), parseInt(str.charAt(3)));
    }

    to_object() {
        // Retourne les données de classe sous forme d'objet.
        // Cet objet est utilisé pour envoyer le move à un api rest
        // (rest_web_service_player)
        return {from: this._colonne, to: this._ligne };
    }

    to_string() {
        // retourne le mouvement sous la forme d'une chaîne
        // cette méthode sert notamment lors de l'affichage de la
        // liste des mouvements quand on clique sur le bouton
        // "Move list" à partir de l'interface graphique.
        if (this.engine().current_color() === WHITE)
        {
            return 'Place WHITE piece in : ' + this._colonne.to_string() + ' / ' + this._ligne.to_string();
        }

        return 'Place BLUE piece in : ' + this._colonne.to_string() + ' / ' + this._ligne.to_string();
    }
}

export default Move;