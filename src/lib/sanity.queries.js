import { groq } from 'next-sanity';

// Requête pour lister TOUS les films (la Médiathèque)
// Nous demandons l'ID, le titre, l'URL propre (slug), le réalisateur, et l'URL de l'affiche
export const FILMS_QUERY = groq`
  *[_type == "film"] | order(_createdAt desc) {
    _id,
    titre,
    slug,
    realisateur,
    "afficheUrl": affiche.asset->url
  }
`;

// Requête pour lister TOUS les articles (Revues/Actualités)
export const ARTICLES_QUERY = groq`
  *[_type == "article"] | order(_createdAt desc) {
    _id,
    titre,
    slug,
    "imageUrl": imagePrincipale.asset->url
  }
`;


// Requête pour lister les 5 derniers articles (pour la page d'accueil)
export const LATEST_ARTICLES_QUERY = groq`
  *[_type == "article"] | order(_createdAt desc) [0..4] { // [0..4] limite à 5 articles
    _id,
    titre,
    slug,
    // Nous récupérons le contenu pour l'afficher en aperçu (excerpt)
    contenu, 
  }
`;