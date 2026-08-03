export function isAdminEmail(email: string | null | undefined): boolean {
  const list = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);
  return !!email && list.includes(email.toLowerCase());
}
