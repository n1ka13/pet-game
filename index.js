const { feed, sleep, play, showStatus, startLife } = require("./pet.js");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "Enter comand - feed/sleep/play/tick: ",
});

startLife();
