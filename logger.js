function log(action, details) {
  const time = new Date().toISOString();
  console.log(`[${time}]:${action}:${details}`);
}

module.exports = log;
