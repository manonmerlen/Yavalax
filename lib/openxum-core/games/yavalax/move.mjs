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
    return this._column + (this._color == Color.WHITE ? 'W' : 'B') + this._line;

  }

  parse(str) {
    this._column = str.charAt(0);
    this._line = str.charAt(2);
    this._color = str.charAt(1) === 'W' ? Color.WHITE : Color.BLUE;
    console.log(str);
  }

  to_object() {
  }

  to_string() {
    if (this._color === Color.WHITE) {
      return 'Place WHITE piece in : ' + this._column + ' / ' + this._line;
    }
    return 'Place BLUE piece in : ' + this._column + ' / ' + this._line;
  }

}

export default Move;