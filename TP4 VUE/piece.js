import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

//récupérer les données du JSON
async function getPieces() {
    const reponse = await fetch("pieces-autos.json");
    const pieces = await reponse.json();
    
    pieces.forEach(piece => {
        piece.image = `images/${piece.id}.jpg`; 
    
        piece.disponible = piece.prix < 150; 
    });
    
    return pieces;
}

// Initialisation
createApp({
    data() {
        return {
            pieces: [],
            filtre: {
                recherche: '',
                categorie: 'Toutes',
                disponible: false,
                tri: 'defaut' 
            },
            panierVisible: false, 
            panier: [],
            categories: []
        };
    },
    // le filtrage et le tri
    computed: {
        piecesFiltrees() {
            let pieces = this.pieces;

            //Filtrage par recherche
            if (this.filtre.recherche) {
                const recherche = this.filtre.recherche.toLowerCase();
                pieces = pieces.filter(piece => 
                    piece.nom.toLowerCase().includes(recherche)
                );
            }

            //Filtrage par catégorie
            if (this.filtre.categorie !== 'Toutes') {
                pieces = pieces.filter(piece => 
                    piece.categorie === this.filtre.categorie
                );
            }

            //Filtrage par disponibilité
            if (this.filtre.disponible) {
                pieces = pieces.filter(piece => piece.disponible);
            }

            //Tri
            if (this.filtre.tri === 'prix-croissant') {
                pieces.sort((a, b) => a.prix - b.prix);
            } else if (this.filtre.tri === 'prix-decroissant') {
                pieces.sort((a, b) => b.prix - a.prix);
            }
            
            return pieces;
        },
        //total du panier
        totalPanier() {
            return this.panier.reduce((total, item) => total + item.prix, 0);
        }
    },

    methods: {
        ajouterAuPanier(piece) {
            if (piece.disponible) {
                this.panier.push(piece);
                this.panierVisible = true; 
            } else {
                alert(`${piece.nom} n'est pas disponible en stock.`);
            }
        },
        togglePanier() {
            this.panierVisible = !this.panierVisible;
        },
        //obtention des catégories
        getCategories() {
            const categories = new Set(this.pieces.map(piece => piece.categorie));
            this.categories = ['Toutes', ...Array.from(categories)];
        },
        //le tri
        trierPieces(type) {
            this.filtre.tri = type;
        },
        
    },
    //charger les données au démarrage
    async created() {
        this.pieces = await getPieces();
        this.getCategories();
    }
}).mount('body'); 


