// a ZSet of all answered words
export function answersKey(username: string) {
  return `${username}_answers`;
}

// a number containing the user's current point total
export function pointsKey(username: string) {
  return `${username}_points`;
}

// count of numer of sessions by user
export function sessionCountKey(username: string) {
  return `${username}_sessionCount`;
}

// epoch milli timestamp of beginning of user's last session
export function lastSessionKey(username: string) {
  return `${username}_lastSession`;
}
