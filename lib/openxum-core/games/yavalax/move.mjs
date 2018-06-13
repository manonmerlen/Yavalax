"use strict";

import Coordinates from './coordinates.mjs';

class Move {
    constructor(c1, c2) {
        this._from = c1;
        this._to = c2;
    }

// public methods
    from() {
        return this._from;
    }

    to() {
        return this._to;
    }

    get() {
        return this._from.to_string() + this._to.to_string();
    }

    parse(str) {
        // permet de set la source et la destination à partir d'une chaîne.
        this._from = new Coordinates(str.charAt(0), parseInt(str.charAt(1)));
        this._to = new Coordinates(str.charAt(2), parseInt(str.charAt(3)));
    }

    to_object() {
        // Retourne les données de classe sous forme d'objet.
        // Cet objet est utilisé pour envoyer le move à un api rest
        // (rest_web_service_player)
        return {from: this._from, to: this._to };
    }

    to_string() {
        // retourne le mouvement sous la forme d'une chaîne
        // cette méthode sert notamment lors de l'affichage de la
        // liste des mouvements quand on clique sur le bouton
        // "Move list" à partir de l'interface graphique.
        return 'move piece ' + this._from.to_string() + ' to ' + this._to.to_string();
    }
}

export default Move;