"use strict";

import OpenXum from '../../openxum/gui.mjs';
import Yavalax from '../../../openxum-core/games/yavalax/index.mjs';

class Gui extends OpenXum.Gui {
  constructor(c, e, l, g) {
    super(c, e, l, g);
    this._deltaX = 0;
    this._deltaY = 0;
    this._offsetX = 0;
    this._offsetY = 0;
    this._move = undefined;
    this.cpwhite = 1;
    this.cpblue = 0;
    this._next = 0;
    this._next_next = 1;
    this.selected_cord = [];
  }

  draw() {
    this._context.fillStyle = "#030303";
    this._round_rect(0, 0, this._canvas.width, this._canvas.height, 17, true, true);
    this._draw_grid();
    this._draw_state();
  }

  get_move() {
    let moo = new Yavalax.Move(this.selected_cord[0], this.selected_cord[1], this.engine().current_color());

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
  }

  set_canvas(c) {
    super.set_canvas(c);
    this._height = this._canvas.height;
    this._width = this._canvas.width;
    this._deltaX = (this._width * 0.95 - 30) / 13;
    this._deltaY = (this._height * 0.95 - 30) / 13;
    this._offsetX = this._width / 2 - this._deltaX * 6.5;
    this._offsetY = this._height / 2 - this._deltaY * 6.5;
    this._canvas.addEventListener("click", (e) => {
      this._on_click(e);
    });

    this.draw();
  }

  _color_change() {
    if (this.cpwhite === 1) {
      this.cpwhite = -1;
      this.cpblue = 0;
      this._next = 1;
      this._next_next = 1;
      return;
    }
    if (this.cpwhite === 0) {
      this.cpwhite = 1;
      this._next = 0;
      this._next_next = 1;
      return;
    }
    if (this.cpblue === 0) {
      this.cpblue = 1;
      this._next = 1;
      this._next_next = 0;
      return;
    }
    if (this.cpblue === 1) {
      this.cpblue = -1;
      this.cpwhite = 0;
      this._next = 0;
      this._next_next = 0;
      return;
    }
  }

  _conversion_case_pixel(column, line) {
    column = (column - this._offsetX - 4) / this._deltaX;
    line = (line - this._offsetY - 3) / this._deltaY;
    return [column, line];
  }

  _conversion_pixel_case(column, line) {
    column = (column * this._deltaX + 0.5) + this._offsetX + 18;
    line = (line * this._deltaX - 0.5) + this._offsetX + 19;
    return [column, line];
  }

  _crown_place(column, line) {
    this._draw_crown(column, line);
    if (this.engine()._win_piece[0] === 1) {
      for (let xx = 1; xx <= this.engine()._win_piece[1]; xx++) {
        this._draw_crown(column - xx, line);
      }
      for (let xx = 1; xx <= this.engine()._win_piece[2]; xx++) {
        this._draw_crown(column + xx, line);
      }
    }
    if (this.engine()._win_piece[3] === 1) {
      for (let xx = 1; xx <= this.engine()._win_piece[4]; xx++) {
        this._draw_crown(column, line + xx);
      }
      for (let xx = 1; xx <= this.engine()._win_piece[5]; xx++) {
        this._draw_crown(column, line - xx);
      }
    }
    if (this.engine()._win_piece[6] === 1) {
      for (let xx = 1; xx <= this.engine()._win_piece[7]; xx++) {
        this._draw_crown(column - xx, line + xx);
      }
      for (let xx = 1; xx <= this.engine()._win_piece[8]; xx++) {
        this._draw_crown(column + xx, line - xx);
      }
    }
    if (this.engine()._win_piece[9] === 1) {
      for (let xx = 1; xx <= this.engine()._win_piece[10]; xx++) {
        this._draw_crown(column - xx, line - xx);
      }
      for (let xx = 1; xx <= this.engine()._win_piece[11]; xx++) {
        this._draw_crown(column + xx, line + xx);
      }
    }
  }

  _draw_crown(column, line) {
    this._context.fillStyle = "#FFD700";
    let radius = (this._deltaX / 2.3);
    let pt = this._conversion_pixel_case(column, line);
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

  _draw_error_cross(column, line) {
    this._context.beginPath();
    this._context.moveTo(this._offsetX + column * this._deltaX + 12,
      this._offsetY + line * this._deltaY + 12);
    this._context.lineTo(this._offsetX + (column + 0.7) * this._deltaX - 2,
      this._offsetY + (line + 0.7) * this._deltaY - 2);
    this._context.closePath();
    this._context.stroke();
    this._context.beginPath();
    this._context.moveTo(this._offsetX + column * this._deltaX + 12,
      this._offsetY + (line + 0.7) * this._deltaY - 2);
    this._context.lineTo(this._offsetX + (column + 0.7) * this._deltaX - 2,
      this._offsetY + line * this._deltaY + 12);
    this._context.closePath();
    this._context.stroke();
  }

  _draw_grid() {
    this._context.lineWidth = 1;
    this._context.strokeStyle = "#000000";
    this._context.fillStyle = "#C0C0C0";
    for (let column = 0; column < 13; ++column) {
      for (let line = 0; line < 13; ++line) {
        this._context.beginPath();
        this._context.moveTo(this._offsetX + column * this._deltaX, this._offsetY + line * this._deltaY);
        this._context.lineTo(this._offsetX + (column + 1) * this._deltaX - 2, this._offsetY + line * this._deltaY);
        this._context.lineTo(this._offsetX + (column + 1) * this._deltaX - 2, this._offsetY + (line + 1) * this._deltaY - 2);
        this._context.lineTo(this._offsetX + column * this._deltaX, this._offsetY + (line + 1) * this._deltaY - 2);
        this._context.moveTo(this._offsetX + column * this._deltaX, this._offsetY + line * this._deltaY);
        this._context.closePath();
        this._context.fill();
      }
    }
    this._draw_square_1(this.engine().current_color());
    this._draw_square_2(this.engine().alt_color());
  }

  _draw_piece_colored(column, line, color) {
    let pt = this._conversion_pixel_case(column, line);
    if (color === 0) {
      this._context.fillStyle = "#FFFFFF";
    }
    if (color === 1) {
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

  _draw_square_1(color) {
    let pt = this._conversion_case_pixel(2, 3);
    if (color === 0) {
      this._context.fillStyle = "#FFFFFF";
    }
    if (color === 1) {
      this._context.fillStyle = "#1240F7";
    }
    this._context.beginPath();
    this._context.moveTo(this._offsetX + (pt[0] - 0.1) * this._deltaX + 12,
      this._offsetY + (pt[1] - 0.1) * this._deltaY + 10);
    this._context.lineTo(this._offsetX + (pt[0] + 0.5) * this._deltaX + 10,
      this._offsetY + (pt[1] - 0.1) * this._deltaY + 10);
    this._context.lineTo(this._offsetX + (pt[0] + 0.5) * this._deltaX + 10,
      this._offsetY + (pt[1] + 0.5) * this._deltaY + 8);
    this._context.lineTo(this._offsetX + (pt[0] - 0.1) * this._deltaX + 12,
      this._offsetY + (pt[1] + 0.5) * this._deltaY + 8);
    this._context.moveTo(this._offsetX + (pt[0] + 0.1) * this._deltaX + 12,
      this._offsetY + (pt[1] + 0.1) * this._deltaY + 10);
    this._context.closePath();
    this._context.fill();
  }

  _draw_square_2(color) {
    let pt = this._conversion_case_pixel(30, 3);
    if (color === 0) {
      this._context.fillStyle = "#FFFFFF";
    }
    if (color === 1) {
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

  _draw_state() {
    for (let column = 0; column < 13; column++) {
      for (let line = 0; line < 13; line++) {
        if (this.engine()._board[column][line] === 0) {
          this._draw_piece_colored(column, line, 0);
        }
        if (this.engine()._board[column][line] === 1) {
          this._draw_piece_colored(column, line, 1);
        }
      }
    }
    if (this.engine()._winner) {
      this._crown_place(this.engine().last_column, this.engine().last_line);
    }
    for (let column = 0; column < 13; column++) {
      for (let line = 0; line < 13; line++) {
        if (this.engine()._free_case(column, line) && (!this.engine()._check_5(column, line, this.engine().current_color()) ||
          this.engine()._check_double_4(column, line, this.engine().current_color()) === 1)) {
          this._context.strokeStyle = "#000000";
          this._draw_error_cross(column, line);
        }
      }
    }
    this._draw_square_1(this._next);
    this._draw_square_2(this._next_next);
    this._color_change();
  }

  _get_click_position(e) {
    let rect = this._canvas.getBoundingClientRect();
    return {x: (e.clientX - rect.left) * this._scaleX, y: (e.clientY - rect.top) * this._scaleY};
  }

  _on_click(event) {
    let pos = this._get_click_position(event);
    let c = this._conversion_case_pixel(pos.x + 5, pos.y + 5);
    if (!this._engine.is_finished()) {
      if (this.engine()._valid_move(Math.trunc(c[0]), Math.trunc(c[1]), this.engine().current_color())) {
        this.selected_cord[0] = Math.trunc(c[0]);
        this.selected_cord[1] = Math.trunc(c[1]);
        this._manager.play();
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
}


export default {
  Gui: Gui
};