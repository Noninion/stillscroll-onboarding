export const LIFESPAN_YEARS = 85;

export function getMaxTargetHours(currentHours) {
  return Math.max(0, Number(currentHours) - 1);
}

export function clampTargetHours(targetHours, currentHours) {
  const maxTarget = getMaxTargetHours(currentHours);
  return Math.min(Math.max(0, Number(targetHours)), maxTarget);
}

export function getSavedHoursPerDay(currentHours, targetHours) {
  return Math.max(0, Number(currentHours) - Number(targetHours));
}

export function getYearlySavedDays(currentHours, targetHours) {
  const savedHours = getSavedHoursPerDay(currentHours, targetHours);
  return Math.round((savedHours * 365) / 24);
}

export function getLifetimeReclaimedYears(currentHours, targetHours) {
  const savedHours = getSavedHoursPerDay(currentHours, targetHours);
  return Math.round((savedHours * LIFESPAN_YEARS) / 24);
}
