export default function getEmailFromCookie(): string | null {
  if (typeof document === 'undefined') return null; // Check if we're on the client-side
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'user_email') {
      return decodeURIComponent(value);
    }
  }
  return null;
}
