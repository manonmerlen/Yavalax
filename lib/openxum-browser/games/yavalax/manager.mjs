"use strict";

import OpenXum from '../../openxum/manager.mjs';
import Yavalax from '../../../openxum-core/games/yavalax/index.mjs';

class Manager extends OpenXum.Manager {
  constructor(e, g, o, s) {
    super(e, g, o, s);
    this.that(this);
  }

  build_move() {
    return new Yavalax.Move();
  }

  get_current_color() {
    return this.engine().current_color() === Yavalax.Color.WHITE ? 'White' : 'Blue';
  }

  static get_name() {
    return 'yavalax';
  }

  get_winner_color() {
    return this.engine().winner_is() === Yavalax.Color.WHITE ? 'white' : 'blue';
  }

  process_move() {
  }
}

export default {
  Manager: Manager
};