
/**
 * Removes UiO subdomains from the signup email
 * @param email email string
 * @returns normalized email string
 */
export function normalizeEmail(email) {
  
  const [user, domain] = email.split("@");
  
  if (domain.endsWith(".uio.no")) {
    return `${user}@uio.no`;
  }
  
  return email;
}