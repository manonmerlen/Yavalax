let OpenXum = require('./openxum');
let RestWebServicePlayer = require('./rest_web_service_player');

let e = new OpenXum.Invers.Engine(OpenXum.Invers.GameType.STANDARD, OpenXum.Invers.Color.RED);
let p1 = new RestWebServicePlayer(OpenXum.Invers.Color.RED, e, 'toto');
let p2 = new OpenXum.Invers.RandomPlayer(OpenXum.Invers.Color.YELLOW, e);

p1.set_url('http://127.0.0.1:3000');

let start = new Promise((resolve, reject) => {
  p1.start(resolve);
});

let play = (finish) => {

  (new Promise((resolve, reject) => {
    p1.move(resolve);
  })).then((data) => {
    let move = new OpenXum.Invers.Move(data.color, data.letter, data.number, data.position);

    console.log("P1: " + JSON.stringify(move.to_object()));

    e.move(move);
    if (!e.is_finished()) {
      let move = p2.move();

      console.log("P2: " + JSON.stringify(move.to_object()));

      e.move(move);
      (new Promise((resolve, reject) => {
        p1.move(resolve, move);
      })).then(() => {
        if (!e.is_finished()) {
          play(finish);
        } else {
          finish();
        }
      }).catch(() => {
        console.log("FAILED");
      });
    } else {
      finish();
    }
  }).catch(() => {
    console.log("FAILED");
  });

};

start.then(() => {

  play(() => {
    console.log('FINISH');
  });

});
