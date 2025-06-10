const memoize = require("./memoize.js");
const log = require("./logger.js");
const petEvents = require("./events.js");
const fs = require("fs");

let hunger = 0;
let energy = 100;

const calcEnergy = memoize((enrg) => Math.max(0, enrg - 25));

const getMood = memoize((hunger, energy) => {
  const moods = [];
  if (hunger > 80) moods.push("angry");
  if (energy < 20) moods.push("tired");
  if (moods.length === 0) return "happy";
  return moods.join(" and ");
});

function logHistory(action = "tick") {
  const logEntry = `${new Date().toISOString()}, ${action}, hunger=${hunger}, energy=${energy}\n`;
  fs.appendFile("pet_history.log", logEntry, { flag: "a" }, (err) => {
    if (err) console.error("Error writing history");
  });
}

function updateStatus() {
  let sleepStatus =
    energy <= 25 ? "Pet wants to sleep" : "Pet is full of energy";
  let hungerStatus = hunger >= 50 ? "Pet is hungry" : "Pet doesn`t want to eat";
  let mood = getMood(hunger, energy);

  const statusMessage = `Pet's hunger now is ${hunger}. ${hungerStatus}. The level of energy: ${energy}. ${sleepStatus}.\n Pet is ${mood} at the moment.`;

  fs.writeFile("pet_status.txt", statusMessage, (err) => {
    if (err) console.error("Error writing status:", err);
  });
}

function feed() {
  hunger = Math.min(0, hunger + 10);
  updateStatus();
  logHistory("feed");
  petEvents.emit("feed");
  log("HUNGER", `hunger=${hunger}`);
}

function sleep() {
  energy = Math.min(100, energy + 30);
  updateStatus();
  logHistory("sleep");
  petEvents.emit("sleep");
  log("SLEEP", `energy=${energy}`);
}

function play() {
  energy = calcEnergy(energy);
  hunger += 5;
  updateStatus();
  logHistory("play");
  petEvents.emit("play");
  log("PLAY", `energy=${energy}`, `hunger=${hunger}`);
}

function showStatus() {
  const stream = fs.createReadStream("pet_status.txt", "utf-8");
  stream.on("data", (chunk) => console.log(`Status:\n` + chunk));
}

function analyzeHistory() {
  console.log("Analysis: \n");

  let totalEnergy = 0;
  let entriesCount = 0;
  let starvingCount = 0;

  if (!fs.existsSync("pet_history.log")) {
    return console.log(
      "History is clear, please use some commands: feed/play/sleep"
    );
  }

  const rl = readline.createInterface({
    input: fs.createReadStream("pet_history.log"),
    crlfDelay: Infinity,
  });
}

function startLife() {
  updateStatus();
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
  petEvents.on("tick", () =>
    console.log("Ticks every 5 seconds from beginning")
  );
}

module.exports = { feed, sleep, play, showStatus, startLife };
