/**
 * Valide une adresse email
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valide un mot de passe (minimum 6 caractères)
 */
export const validatePassword = (password) => {
  return password && password.length >= 6
}

/**
 * Valide que le champ n'est pas vide
 */
export const validateRequired = (value) => {
  return value && value.trim() !== ''
}

/**
 * Valide la longueur minimale
 */
export const validateMinLength = (value, minLength) => {
  return value && value.length >= minLength
}

/**
 * Valide la longueur maximale
 */
export const validateMaxLength = (value, maxLength) => {
  return value && value.length <= maxLength
}

/**
 * Valide un nom d'utilisateur (alphanumerique + underscore)
 */
export const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
  return usernameRegex.test(username)
}