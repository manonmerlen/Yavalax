import lib from '../lib/openxum-core/openxum';

let e = new lib.OpenXum.Yavalax.Engine(lib.OpenXum.Yavalax.GameType.STANDARD, lib.OpenXum.Yavalax.Color.WHITE);
let p1 = new lib.OpenXum.RandomPlayer(lib.OpenXum.Yavalax.Color.WHITE, e);
//let p1 = new lib.OpenXum.Yavalax.IA.IAYavalaxPlayer(lib.OpenXum.Yavalax.Color.WHITE, e);
//let p1 = new lib.OpenXum.MCTSPlayer(lib.OpenXum.Yavalax.Color.WHITE, e);
//let p2 = new lib.OpenXum.RandomPlayer(lib.OpenXum.Yavalax.Color.BLUE, e);
//let p2 = new lib.OpenXum.MCTSPlayer(lib.OpenXum.Yavalax.Color.BLUE, e);
let p2 = new lib.OpenXum.Yavalax.IA.IAYavalaxPlayer(lib.OpenXum.Yavalax.Color.BLUE, e);
let p = p1;
let moves = [];

while (!e.is_finished()) {
    let move = p.move();

    moves.push(move);
    e.move(move);
    p = p === p1 ? p2 : p1;
}

console.log("Winner is " + (e.winner_is() === lib.OpenXum.Yavalax.Color.WHITE ? "WHITE" : "BLUE"));
for (let index = 0; index < moves.length; ++index) {
    console.log(moves[index].to_string());
}
