export function getDecodedEmail(email: string | null) {
  if (!email) return "votre adresse email";

  try {
    // Decode URL-encoded email
    return decodeURIComponent(email);
  } catch (error) {
    console.error("Error decoding email:", error);
    // If decoding fails, return the original string
    return Array.isArray(email) ? email[0] || "" : email;
  }
}
