function memoize(fn, ttl = 10 * 60 * 1000) {
  const cache = new Map();

  return (...args) => {
    const key = JSON.stringify(args);
    const now = Date.now();

    if (cache.has(key)) {
      const { time, result } = cache.get(key);
      if (now - time < ttl) return result;
    }

    const result = fn(...args);
    cache.set(key, { time: now, result });
    return result;
  };
}

module.exports = memoize;
