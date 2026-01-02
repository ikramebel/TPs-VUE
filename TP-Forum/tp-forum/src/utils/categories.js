export const categories = [
  {
    id: 'general',
    name: 'Général',
    icon: '💬',
    description: 'Discussions générales et divers'
  },
  {
    id: 'tech',
    name: 'Technologie',
    icon: '💻',
    description: 'Programmation, développement web, outils'
  },
  {
    id: 'lifestyle',
    name: 'Style de vie',
    icon: '🌟',
    description: 'Bien-être, loisirs, voyages'
  },
  {
    id: 'questions',
    name: 'Questions & Réponses',
    icon: '❓',
    description: 'Posez vos questions, obtenez des réponses'
  },
  {
    id: 'announcements',
    name: 'Annonces',
    icon: '📢',
    description: 'Annonces officielles et importantes'
  },
  {
    id: 'help',
    name: 'Aide',
    icon: '🆘',
    description: 'Besoin d\'aide ? Demandez ici'
  }
];

export const getCategoryById = (id) => {
  return categories.find(cat => cat.id === id);
};

export const getCategoryName = (id) => {
  const category = getCategoryById(id);
  return category ? category.name : 'Inconnu';
};

export const getCategoryIcon = (id) => {
  const category = getCategoryById(id);
  return category ? category.icon : '📁';
};