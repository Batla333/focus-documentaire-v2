import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../Header'; 
import { client } from '@/lib/sanity';
import imageUrlBuilder from '@sanity/image-url';

// Configuration images
const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source);
}

// Récupération des articles
async function getArticles() {
  // On récupère "author" en plus du reste.
  // Note : J'ai gardé la compatibilité (titre/title) au cas où.
  const query = `*[_type == "article"] | order(_createdAt desc) {
    _id,
    "title": coalesce(title, titre),
    "author": author,
    slug,
    "publishedAt": _createdAt,
    "mainImage": coalesce(mainImage, imagePrincipale),
    "excerpt": coalesce(excerpt, contenu[0].children[0].text)
  }`;
  
  return await client.fetch(query, {}, { next: { revalidate: 0 } });
}

export default async function ArticlesListPage() {
  const articles = await getArticles();

  return (
    <main style={{ position: 'relative', minHeight: '100vh' }}>
      
      {/* FOND D'ÉCRAN */}
      <div style={{ position: 'fixed', inset: 0, zIndex: -1 }}>
        <Image
          src="/fond-docu.png"
          alt="Fond"
          fill
          style={{ objectFit: 'cover' }}
          quality={100}
        />
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.92)' }}></div>
      </div>

      <Header />

      {/* CONTENU */}
      <section style={{ padding: '160px 5% 80px 5%', maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: '3.5rem', color: '#1a1a1a', margin: 0 }}>
            NOS <span style={{ color: '#33a002' }}>ARTICLES</span>
          </h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          
          {articles.length > 0 ? (
            articles.map((article) => (
              <article key={article._id} style={{ 
                backgroundColor: '#fff', 
                borderRadius: '8px', 
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                display: 'flex', flexDirection: 'column'
              }}>
                
                {/* Image */}
                <div style={{ position: 'relative', height: '220px', backgroundColor: '#eee' }}>
                  {article.mainImage ? (
                     <Image
                       src={urlFor(article.mainImage).url()} 
                       alt={article.title || 'Article'}
                       fill
                       style={{ objectFit: 'cover' }}
                     />
                  ) : (
                    <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999'}}>Pas d'image</div>
                  )}
                </div>

                {/* Texte */}
                <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '5px', color: '#1a1a1a' }}>
                    {article.title}
                  </h3>

                  {/* AFFICHAGE DE L'AUTEUR ICI */}
                  {article.author && (
                    <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.85rem', color: '#888', marginBottom: '15px', fontStyle: 'italic' }}>
                      Par {article.author}
                    </p>
                  )}
                  
                  <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.95rem', color: '#555', flexGrow: 1, marginBottom: '20px' }}>
                    {article.excerpt ? article.excerpt.substring(0, 100) + '...' : ''}
                  </p>
                  
                  <Link href={`/article/${article.slug.current}`} style={{
                    display: 'inline-block', padding: '10px 20px', backgroundColor: '#1a1a1a',
                    color: '#fff', textDecoration: 'none', fontFamily: 'var(--font-montserrat)',
                    textAlign: 'center', borderRadius: '4px', alignSelf: 'start'
                  }}>
                    Lire la suite
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <p style={{ fontFamily: 'var(--font-montserrat)', textAlign: 'center', width: '100%' }}>Aucun article trouvé.</p>
          )}
        </div>
      </section>
    </main>
  );
}