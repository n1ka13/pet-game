const memoize = require("./memoize.js");
const log = require("./logger.js");
const petEvents = require("./events.js");

let hunger = 0;
let energy = 100;

const calcEnergy = memoize((enrg) => Math.max(0, enrg - 25));

function feed() {
  hunger = Math.max(0, hunger - 15);
  petEvents.emit("Feed");
  log("HUNGER", `hunger=${hunger}`);
}

function sleep() {
  energy = Math.max(100, energy + 30);
  petEvents.emit("Sleep");
  log("SLEEP", `energy=${energy}`);
}

function play() {
  energy = calcEnergy(energy);
  hunger += 5;
  petEvents.emit("Play");
  log("PLAY", `energy=${energy}`, `hunger=${hunger}`);
}
