export const ROBOTX_SERVICE_CATEGORIES = [
  "Showcase & Performance",
  "Cleaning",
  "Warehouse",
  "Restaurant",
] as const;

export type RobotxServiceCategory = (typeof ROBOTX_SERVICE_CATEGORIES)[number];

export function isRobotxServiceCategory(
  value: unknown
): value is RobotxServiceCategory {
  if (typeof value !== "string") {
    return false;
  }

  return (ROBOTX_SERVICE_CATEGORIES as readonly string[]).includes(value);
}
