"use strict";

class Coordinates {
    constructor(c, l) {

        this._column = c;
        this._line = l;
    }

    isValid() {
        // Retourne si la coordonnée est valide, c'est-à-dire si elle existe
        // au sein du système de coordonnées décidé au préalable.
    }

    getRepresentation() {
        if (!this.isValid()) {
            return "invalid";
        }

        return this._column + this._line;
    }

    clone() {
        return new Coordinates(this._line, this._column);
    };

    getColumn() {
        return this._column;
    };

    getLine() {
        return this._line;
    };

   // hash() {
        // Construit une représentation unique d'une intersection
        // Cela va notamment nous servir pour retrouver une intersection
        // plus efficacement.
  //      return this._column.charCodeAt(0) + this._line * (4 * this._line) - 7;
 //   };

    equals(coordinate) {
        return this._column === coordinate.getColumn() &&
            this._line === coordinate.getLine();
    };

    to_string() {
        return this.getRepresentation();
    }
}

export default Coordinates;