export function getDecodedEmail(email?: string | string[]) {
  if (!email) return "votre adresse email";

  try {
    // Handle array case
    const emailStr = Array.isArray(email) ? email[0] || "" : email;
    // Decode URL-encoded email
    return decodeURIComponent(emailStr);
  } catch (error) {
    console.error("Error decoding email:", error);
    // If decoding fails, return the original string
    return Array.isArray(email) ? email[0] || "" : email;
  }
}
