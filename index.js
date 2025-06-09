const { feed, sleep, play, showStatus, startLife } = require("./pet.js");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "Enter comand - feed/sleep/play/pet: ",
});

startLife();

rl.prompt();

rl.on("line", (line) => {
  const command = line.trim().toLowerCase();

  switch (command) {
    case "feed":
      feed();
      break;
    case "sleep":
      sleep();
      break;
    case "play":
      play();
      break;
    case "pet":
      showStatus();
      break;
    default:
      console.log(
        "Unknown command, try one of this: feed or sleep or play or pet"
      );
  }
});
