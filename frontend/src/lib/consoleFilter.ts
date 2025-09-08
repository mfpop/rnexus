// Dev-only console filter: silence verbose console methods to reduce noise
// This will run automatically when imported. It leaves console.warn and
// console.error intact so real issues are still visible.
try {
  // Vite exposes import.meta, but guard in case executed outside module context
  const isDev =
    typeof import.meta !== "undefined"
      ? (import.meta as any).env?.DEV
      : process.env && process.env["NODE_ENV"] !== "production";
  if (isDev) {
    const noop = () => {};
    // Suppress the most noisy methods
    (console as any).log = noop;
    (console as any).debug = noop;
    (console as any).info = noop;
    (console as any).trace = noop;
    // Keep warn/error so developers still see problems
  }
} catch (e) {
  // If anything fails, don't break the app
}
