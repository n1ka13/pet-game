const memoize = require("./memoize.js");
const log = require("./logger.js");
const petEvents = require("./events.js");

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
  petEvents.emit("Feed");
  log("HUNGER", `hunger=${hunger}`);
}

function sleep() {
  energy = Math.max(100, energy + 30);
  updateStatus();
  petEvents.emit("Sleep");
  log("SLEEP", `energy=${energy}`);
}

function play() {
  energy = calcEnergy(energy);
  hunger += 5;
  updateStatus();
  petEvents.emit("Play");
  log("PLAY", `energy=${energy}`, `hunger=${hunger}`);
}

function showStatus() {
  const stream = fs.createReadStream("pet_status.txt", "utf-8");
  stream.on("data", (chunk) => console.log(`Status:\n` + chunk));
}
