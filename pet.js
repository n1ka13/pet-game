const memoize = require("./memoize.js");
const log = require("./logger.js");
const petEvents = require("./events.js");
const fs = require("fs");

let hunger = 0;
let energy = 100;

const calcEnergy = memoize((enrg) => Math.max(0, enrg - 25));

function updateStatus() {
  let sleepStatus =
    energy <= 25 ? "Pet wants to sleep" : "Pet is full of energy";
  let hungerStatus = hunger >= 50 ? "Pet is hungry" : "Pet doesn`t want to eat";

  const statusMessage = `Pet's hunger now is ${hunger}. ${hungerStatus}. The level of energy: ${energy}. ${sleepStatus}.\n`;

  fs.writeFile("pet_status.txt", statusMessage, (err) => {
    if (err) console.error("Error writing status:", err);
  });
}

function feed() {
  hunger = Math.max(0, hunger - 15);
  updateStatus();
  petEvents.emit("feed");
  log("HUNGER", `hunger=${hunger}`);
}

function sleep() {
  energy = Math.min(100, energy + 30);
  updateStatus();
  petEvents.emit("sleep");
  log("SLEEP", `energy=${energy}`);
}

function play() {
  energy = calcEnergy(energy);
  hunger += 5;
  updateStatus();
  petEvents.emit("play");
  log("PLAY", `energy=${energy}`, `hunger=${hunger}`);
}

function showStatus() {
  const stream = fs.createReadStream("pet_status.txt", "utf-8");
  stream.on("data", (chunk) => console.log(`Status:\n` + chunk));
}

function startLife() {
  setInterval(() => {
    hunger += 10;
    energy = Math.max(0, energy - 10);
    petEvents.emit("tick");
  }, 5000);

  petEvents.on("feed", () =>
    console.log("Pet has eaten and now is a bit happier")
  );
  petEvents.on("sleep", () =>
    console.log("Pet has slept and now has more energy")
  );
  petEvents.on("play", () =>
    console.log("Pet has played a bit and now is a bit tired")
  );
  petEvents.on("tick", () => showStatus());
}

module.exports = { feed, sleep, play, showStatus, startLife };
