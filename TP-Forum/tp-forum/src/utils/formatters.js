// Formater les dates
export const formatDate = (date) => {
  if (!date) return '';
  
  // Convertir en Date si c'est un timestamp Firebase
  const dateObj = date.toDate ? date.toDate() : new Date(date);
  
  const now = new Date();
  const diff = now - dateObj;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'À l\'instant';
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (hours < 24) return `Il y a ${hours}h`;
  if (days < 7) return `Il y a ${days}j`;
  
  return dateObj.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: dateObj.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

// Formater la date complète
export const formatFullDate = (date) => {
  if (!date) return '';
  
  const dateObj = date.toDate ? date.toDate() : new Date(date);
  
  return dateObj.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Tronquer le texte
export const truncateText = (text, maxLength = 150) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Formater les nombres
export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

// Obtenir les initiales d'un nom
export const getInitials = (name) => {
  if (!name) return 'U';
  
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// Générer une couleur à partir d'une chaîne
export const stringToColor = (str) => {
  if (!str) return '#6366f1';
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
    '#f59e0b', '#10b981', '#14b8a6', '#06b6d4',
    '#3b82f6', '#6366f1', '#a855f7', '#d946ef'
  ];
  
  return colors[Math.abs(hash) % colors.length];
};