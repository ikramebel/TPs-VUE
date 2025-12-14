export const CATEGORIES = [
  {
    id: 'technologie',
    name: 'Technologie',
    icon: '💻',
    description: 'Discussions sur la technologie, programmation, etc.',
    subCategories: [
      { id: 'programmation', name: 'Programmation' },
      { id: 'web', name: 'Développement Web' },
      { id: 'mobile', name: 'Applications Mobiles' },
      { id: 'ia', name: 'Intelligence Artificielle' }
    ]
  },
  {
    id: 'science',
    name: 'Science',
    icon: '🔬',
    description: 'Discussions scientifiques',
    subCategories: [
      { id: 'physique', name: 'Physique' },
      { id: 'biologie', name: 'Biologie' },
      { id: 'chimie', name: 'Chimie' },
      { id: 'mathematiques', name: 'Mathématiques' }
    ]
  },
  {
    id: 'culture',
    name: 'Culture',
    icon: '🎭',
    description: 'Art, littérature, cinéma, musique',
    subCategories: [
      { id: 'cinema', name: 'Cinéma' },
      { id: 'musique', name: 'Musique' },
      { id: 'litterature', name: 'Littérature' },
      { id: 'art', name: 'Art' }
    ]
  },
  {
    id: 'sport',
    name: 'Sport',
    icon: '⚽',
    description: 'Tous les sports',
    subCategories: [
      { id: 'football', name: 'Football' },
      { id: 'basketball', name: 'Basketball' },
      { id: 'tennis', name: 'Tennis' },
      { id: 'fitness', name: 'Fitness' }
    ]
  },
  {
    id: 'divers',
    name: 'Divers',
    icon: '📌',
    description: 'Autres sujets',
    subCategories: []
  }
]

export const getCategoryById = (categoryId) => {
  return CATEGORIES.find(cat => cat.id === categoryId)
}

export const getCategoryIcon = (categoryId) => {
  const category = getCategoryById(categoryId)
  return category ? category.icon : '📌'
}

export const getCategoryName = (categoryId) => {
  const category = getCategoryById(categoryId)
  return category ? category.name : categoryId
}