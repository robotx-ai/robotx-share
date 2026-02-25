function getAdminEmailAllowlist() {
  return (process.env.ROBOTX_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function hasRobotxAdminConfig() {
  return getAdminEmailAllowlist().length > 0;
}

export function isRobotxAdminEmail(email: string | null | undefined) {
  if (!email) {
    return false;
  }

  return getAdminEmailAllowlist().includes(email.toLowerCase());
}
