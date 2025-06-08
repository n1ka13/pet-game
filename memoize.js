function memoize(fn, ttl = 10 * 60 * 1000) {
  const cache = new Map();

  return (...args) => {
    const key = JSON.stringify(args);
    const now = Date.now();
  };
}
