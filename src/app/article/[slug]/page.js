import React from 'react';
import Image from 'next/image';
import { client } from '@/lib/sanity';
import imageUrlBuilder from '@sanity/image-url';
import { PortableText } from '@portabletext/react'; 
import Header from '../../Header'; 

// Configuration images
const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source);
}

// Récupération article unique
async function getArticle(slug) {
  const query = `*[_type == "article" && slug.current == $slug][0] {
    "title": coalesce(title, titre),
    "author": author,
    "mainImage": coalesce(mainImage, imagePrincipale),
    "publishedAt": _createdAt,
    "body": coalesce(body, contenu)
  }`;
  return await client.fetch(query, { slug }, { next: { revalidate: 0 } });
}

export default async function SingleArticlePage({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return (
      <main>
        <Header />
        <div style={{ textAlign: 'center', marginTop: '150px', fontFamily: 'var(--font-montserrat)' }}>
          <h1>Article introuvable</h1>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <Header />

      <article style={{ maxWidth: '800px', margin: '0 auto', padding: '160px 5% 80px 5%' }}>
        
        {/* Titre */}
        <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: '3rem', lineHeight: '1.1', marginBottom: '20px', color: '#1a1a1a' }}>
          {article.title}
        </h1>

        {/* MÉTADONNÉES : DATE ET AUTEUR */}
        <div style={{ marginBottom: '30px', fontFamily: 'var(--font-montserrat)', fontSize: '0.9rem', display: 'flex', gap: '15px', alignItems: 'center' }}>
           
           {/* Date avec suppressHydrationWarning */}
           {article.publishedAt && (
             <span suppressHydrationWarning style={{ color: '#33a002', fontWeight: 'bold' }}>
               Publié le {new Date(article.publishedAt).toLocaleDateString('fr-FR')}
             </span>
           )}

           {/* Auteur */}
           {article.author && (
             <span style={{ color: '#666', fontStyle: 'italic' }}>
               — écrit par {article.author}
             </span>
           )}
        </div>

        {/* Image */}
        {article.mainImage && (
          <div style={{ position: 'relative', width: '100%', height: '450px', marginBottom: '50px', borderRadius: '8px', overflow: 'hidden' }}>
            <Image
              src={urlFor(article.mainImage).url()}
              alt={article.title || 'Image article'}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        )}

        {/* Corps du texte */}
        <div style={{ fontFamily: 'var(--font-montserrat)', lineHeight: '1.8', fontSize: '1.1rem', color: '#333' }}>
            {article.body && <PortableText value={article.body} />}
        </div>

      </article>
    </main>
  );
}