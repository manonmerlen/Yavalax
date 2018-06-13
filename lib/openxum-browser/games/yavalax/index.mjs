"use strict";

// lib/openxum-browser/games/yavalax/index.mjs
let Yavalax = {};

import Gui from './gui.mjs';
import Manager from './manager.mjs';

Yavalax = Object.assign(Yavalax, Gui);
Yavalax = Object.assign(Yavalax, Manager);

export default Yavalax;