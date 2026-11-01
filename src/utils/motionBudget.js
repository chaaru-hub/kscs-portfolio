// Lets heavy one-off animations (e.g. a 3D card flip) ask ambient effects to hold still briefly.
const budget = { until: 0 };

export function reserveFrames(ms) {
  budget.until = Math.max(budget.until, performance.now() + ms);
}

export function isReserved() {
  return performance.now() < budget.until;
}
