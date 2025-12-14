/**
 * Formate une date Firestore en format lisible
 */
export const formatDate = (timestamp) => {
  if (!timestamp) return ''
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

/**
 * Formate une date en format relatif (il y a X minutes/heures/jours)
 */
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return ''
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  const now = new Date()
  const diffInMs = now - date
  
  const seconds = Math.floor(diffInMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)
  
  if (seconds < 60) return 'À l\'instant'
  if (minutes < 60) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`
  if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`
  if (days < 30) return `Il y a ${days} jour${days > 1 ? 's' : ''}`
  if (months < 12) return `Il y a ${months} mois`
  return `Il y a ${years} an${years > 1 ? 's' : ''}`
}

/**
 * Tronque un texte à une longueur donnée
 */
export const truncateText = (text, maxLength = 150) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

/**
 * Formate un nombre (ex: 1000 -> 1k)
 */
export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num.toString()
}