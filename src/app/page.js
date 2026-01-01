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
  return builder.image(source);
}

// --- RÉCUPÉRATION MIXTE (Articles + Films) ---
async function getLatestContent() {
  const query = `*[_type in ["article", "film"]] | order(_createdAt desc)[0...6] {
    _id,
    _type,
    "title": coalesce(title, titre),
    slug,
    _createdAt,
    "image": coalesce(mainImage, affiche),
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

      <BannerDocutheque />

      {/* 2. STYLE CSS INTÉGRÉ (Pour la grille journal) */}
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
            grid-auto-rows: minmax(250px, auto);
          }
          
          /* Le 1er article : Grand format (Prend 2/3 largeur, 2 hauteurs) */
          .news-item:nth-child(1) {
            grid-column: span 8;
            grid-row: span 2;
          }
          .news-item:nth-child(1) h3 { font-size: 2.5rem !important; }

          /* Le 2ème et 3ème : Colonne de droite (Empilés) */
          .news-item:nth-child(2),
          .news-item:nth-child(3) {
            grid-column: span 4;
            grid-row: span 1;
          }

          /* Les 4, 5, 6 : En bas, alignés */
          .news-item:nth-child(n+4) {
            grid-column: span 4;
            grid-row: span 1;
          }
        }
        
        .news-card:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
      `}</style>

      {/* 3. LA SECTION ACTUALITÉS */}
      <section style={{ padding: '80px 5%', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Titre Section */}
        <div style={{ 
          borderBottom: '2px solid #1a1a1a', marginBottom: '40px', paddingBottom: '10px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'
        }}>
          <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: '3rem', margin: 0, lineHeight: 1 }}>
            À LA <span style={{ color: '#33a002' }}>UNE</span>
          </h2>
          <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>
            Dernières actualités sur FOCUS documentaire
          </span>
        </div>

        {/* GRILLE JOURNAL */}
        <div className="journal-grid">
          {latestContent.map((item, index) => (
            <Link 
              key={item._id} 
              href={item._type === 'article' ? `/article/${item.slug.current}` : `/docutheque`} 
              className={`news-item news-item-${index}`} // Classe pour cibler en CSS
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
                <div style={{ position: 'relative', width: '100%', flexGrow: 1, minHeight: '200px', backgroundColor: '#f0f0f0' }}>
                  {/* Étiquette sur l'image */}
                  <div style={{ 
                    position: 'absolute', top: 10, left: 10, zIndex: 2,
                    padding: '5px 10px', 
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
                  <h3 style={{ 
                    fontFamily: 'var(--font-bebas)', 
                    fontSize: '1.4rem', // Taille par défaut, écrasée par le CSS pour le 1er
                    margin: '0 0 10px 0', lineHeight: '1.1'
                  }}>
                    {item.title}
                  </h3>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <p style={{ fontSize: '0.75rem', color: '#999', fontFamily: 'var(--font-montserrat)', margin: 0 }}>
                      {new Date(item._createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>

                  <p style={{ 
                    fontFamily: 'var(--font-montserrat)', fontSize: '0.9rem', color: '#555', lineHeight: '1.5',
                    display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden'
                  }}>
                    {item.excerpt ? item.excerpt.substring(0, 100) + '...' : ''}
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