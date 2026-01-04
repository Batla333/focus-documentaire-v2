import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { client } from '@/lib/sanity';
import imageUrlBuilder from '@sanity/image-url';
import HeroSlider from './HeroSlider'; 
import Header from './Header';
import BannerDocutheque from '../components/BannerDocutheque';

// Configuration Image
const builder = imageUrlBuilder(client);
function urlFor(source) {
  // Petite sécurité : si pas d'image, on retourne null
  return source ? builder.image(source) : null;
}

// --- RÉCUPÉRATION MIXTE (Articles + Films) ---
async function getLatestContent() {
  // MODIFICATION ICI : On ajoute 'poster' dans la liste pour les films
  // On garde 'affiche' et 'titre' au cas où il reste de vieilles données
  const query = `*[_type in ["article", "film"]] | order(_createdAt desc)[0...6] {
    _id,
    _type,
    "title": coalesce(title, titre),
    slug,
    _createdAt,
    "image": coalesce(mainImage, poster, affiche), 
    "excerpt": coalesce(excerpt, synopsis[0].children[0].text)
  }`;
  
  return await client.fetch(query, {}, { next: { revalidate: 60 } });
}

export default async function HomePage() {
  const latestContent = await getLatestContent();

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      
      {/* 0. HEADER */}
      <Header />
      
      {/* 1. LE SLIDER */}
      <HeroSlider />

      {/* 2. BANNIÈRE DOCUTHÈQUE */}
      <BannerDocutheque />

      {/* 3. STYLE CSS SPÉCIFIQUE "JOURNAL COMPACT" */}
      <style>{`
        .journal-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        /* SUR ORDI : LE DESIGN QUINCONCE / JOURNAL */
        @media (min-width: 900px) {
          .journal-grid {
            grid-template-columns: repeat(12, 1fr);
            /* Hauteur de ligne réduite pour l'aspect compact */
            grid-auto-rows: minmax(200px, auto); 
          }
          
          /* Le 1er article : Grand format (Prend 2/3 largeur, 2 hauteurs) */
          .news-item:nth-child(1) {
            grid-column: span 8;
            grid-row: span 2;
          }
          /* Titre du 1er article : On garde Bebas mais on réduit la taille */
          .news-item:nth-child(1) h3 { 
              font-size: 2.2rem !important; 
          }

          /* Le 2ème et 3ème : Colonne de droite */
          .news-item:nth-child(2),
          .news-item:nth-child(3) {
            grid-column: span 4;
            grid-row: span 1;
          }

          /* Les 4, 5, 6 : En bas */
          .news-item:nth-child(n+4) {
            grid-column: span 4;
            grid-row: span 1;
          }
        }
        
        .news-card:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
      `}</style>

      {/* 4. LA SECTION ACTUALITÉS */}
      {/* MODIF : Max-width 1000px pour s'aligner avec le slider compact */}
      <section style={{ padding: '60px 5%', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Titre Section */}
        <div style={{ 
          borderBottom: '2px solid #1a1a1a', marginBottom: '30px', paddingBottom: '10px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'
        }}>
          {/* POLICE BEBAS RESTAURÉE + VERT #33a002 */}
          <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: '2.5rem', margin: 0, lineHeight: 0.9 }}>
            À LA <span style={{ color: '#33a002' }}>UNE</span>
          </h2>
          <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.85rem', color: '#666', marginBottom: '3px' }}>
            Dernières actualités
          </span>
        </div>

        {/* GRILLE JOURNAL */}
        <div className="journal-grid">
          {latestContent.map((item, index) => (
            <Link 
              key={item._id} 
              href={item._type === 'article' ? `/article/${item.slug.current}` : `/docutheque`} 
              className={`news-item news-item-${index}`} 
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <article className="news-card" style={{ 
                border: '1px solid #eee', 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                backgroundColor: '#fff',
                transition: 'all 0.3s ease'
              }}>
                
                {/* Image */}
                <div style={{ position: 'relative', width: '100%', flexGrow: 1, minHeight: '180px', backgroundColor: '#f0f0f0' }}>
                  {/* Étiquette sur l'image */}
                  <div style={{ 
                    position: 'absolute', top: 10, left: 10, zIndex: 2,
                    padding: '5px 10px', 
                    /* RESTAURATION DU VERT #33a002 */
                    backgroundColor: item._type === 'article' ? '#1a1a1a' : '#33a002', 
                    color: '#fff', fontFamily: 'var(--font-montserrat)', fontSize: '0.7rem', fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {item._type === 'film' ? 'Docuthèque' : 'Article'}
                  </div>

                  {item.image ? (
                    <Image
                      src={urlFor(item.image).url()}
                      alt={item.title || 'Image'}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>Pas d'image</div>
                  )}
                </div>

                {/* Texte */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                  
                  {/* POLICE BEBAS RESTAURÉE */}
                  <h3 style={{ 
                    fontFamily: 'var(--font-bebas)', 
                    fontSize: '1.2rem', /* Taille réduite (était 1.4rem) */
                    margin: '0 0 10px 0', lineHeight: '1'
                  }}>
                    {item.title}
                  </h3>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <p style={{ fontSize: '0.75rem', color: '#999', fontFamily: 'var(--font-montserrat)', margin: 0 }}>
                      {new Date(item._createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>

                  {/* POLICE MONTSERRAT RESTAURÉE */}
                  <p style={{ 
                    fontFamily: 'var(--font-montserrat)', fontSize: '0.85rem', color: '#555', lineHeight: '1.4',
                    display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden'
                  }}>
                    {item.excerpt ? item.excerpt.substring(0, 90) + '...' : ''}
                  </p>
  
                </div>
              </article>
            </Link>  
          ))}
        </div>
      </section>
      
    </main>
  );
}