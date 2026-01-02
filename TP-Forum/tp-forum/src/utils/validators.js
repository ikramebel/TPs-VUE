export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Valider le mot de passe
export const validatePassword = (password) => {
  return password.length >= 6;
};

// Valider le nom d'utilisateur
export const validateUsername = (username) => {
  return username.length >= 3 && username.length <= 30;
};

// Valider le titre de discussion
export const validateDiscussionTitle = (title) => {
  return title.trim().length >= 5 && title.length <= 200;
};

// Valider le contenu de discussion
export const validateDiscussionContent = (content) => {
  return content.trim().length >= 10;
};

// Valider le contenu de réponse
export const validateReplyContent = (content) => {
  return content.trim().length >= 3;
};

// Messages d'erreur
export const errorMessages = {
  email: {
    required: 'L\'email est requis',
    invalid: 'L\'email n\'est pas valide'
  },
  password: {
    required: 'Le mot de passe est requis',
    tooShort: 'Le mot de passe doit contenir au moins 6 caractères'
  },
  username: {
    required: 'Le nom d\'utilisateur est requis',
    tooShort: 'Le nom d\'utilisateur doit contenir au moins 3 caractères',
    tooLong: 'Le nom d\'utilisateur ne peut pas dépasser 30 caractères'
  },
  discussionTitle: {
    required: 'Le titre est requis',
    tooShort: 'Le titre doit contenir au moins 5 caractères',
    tooLong: 'Le titre ne peut pas dépasser 200 caractères'
  },
  discussionContent: {
    required: 'Le contenu est requis',
    tooShort: 'Le contenu doit contenir au moins 10 caractères'
  },
  replyContent: {
    required: 'Le contenu est requis',
    tooShort: 'Le contenu doit contenir au moins 3 caractères'
  }
};