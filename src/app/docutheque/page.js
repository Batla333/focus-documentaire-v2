"use client";
import { useState, useEffect } from 'react';
import { client } from '@/lib/sanity';
import imageUrlBuilder from '@sanity/image-url';
import Header from '../Header';

// --- UTILITAIRES ---
const builder = imageUrlBuilder(client);
function urlFor(source) {
  return source ? builder.image(source).url() : '/images/placeholder.png';
}

// --- COMPOSANT CARTE FILM ---
function FilmCard({ film, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onClick={() => onClick(film)} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ cursor: 'pointer', position: 'relative', display: 'block' }}
    >
      <div style={{
        position: 'relative',
        aspectRatio: '2/3', 
        borderRadius: '8px',
        overflow: 'hidden', 
        boxShadow: isHovered ? '0 15px 30px rgba(0,0,0,0.3)' : '0 5px 15px rgba(0,0,0,0.1)',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'all 0.3s ease',
        backgroundColor: '#111'
      }}>
        {film.poster && (
          <img 
            src={urlFor(film.poster)} 
            alt={film.title}
            style={{ 
              width: '100%', height: '100%', objectFit: 'cover', 
              transition: 'filter 0.3s ease',
              filter: isHovered ? 'brightness(0.4)' : 'brightness(1)' 
            }}
          />
        )}
        
        {/* Overlay infos */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '15px', textAlign: 'center',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}>
          <h3 style={{ fontFamily: 'var(--font-bebas)', fontWeight: '900', fontSize: '1.2rem', margin: '0 0 5px 0', color: '#fff', textTransform: 'uppercase' }}>
            {film.title}
          </h3>
          <p style={{ fontFamily: 'var(--font-titles)', fontSize: '0.8rem', color: '#33a002', fontWeight: '700', margin: 0, textTransform: 'uppercase' }}>
            {film.director}
          </p>
          {film.year && (
             <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.75rem', color: '#ccc', margin: '5px 0 0 0' }}>
               {film.year}
             </p>
          )}
          <div style={{ marginTop: '15px', border: '1px solid #33a002', padding: '5px 15px', borderRadius: '50px', color: '#fff', fontFamily: 'var(--font-titles)', fontSize: '0.7rem', textTransform: 'uppercase' }}>
            Regarder
          </div>
        </div>
      </div>
    </div>
  );
}

// --- PLAYER MODAL ---
function VideoPlayerModal({ film, onClose }) {
  if (!film || !film.youtubeId) return null;

  return (
    <div 
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.95)', zIndex: 11000, 
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
        animation: 'fadeIn 0.3s ease'
      }}
      onClick={onClose} 
    >
      <button 
        onClick={onClose}
        style={{
          position: 'absolute', top: '20px', right: '20px',
          background: 'none', border: 'none', color: 'white',
          fontSize: '2rem', cursor: 'pointer', fontFamily: 'sans-serif', zIndex: 11001
        }}
      >✕</button>

      <div style={{ width: '100%', maxWidth: '900px', aspectRatio: '16/9', position: 'relative', boxShadow: '0 0 50px rgba(0,0,0,0.5)' }} onClick={(e) => e.stopPropagation()}>
          <iframe 
            width="100%" height="100%" 
            src={`https://www.youtube.com/embed/${film.youtubeId}?autoplay=1&rel=0`} 
            title={film.title} 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen 
            style={{ borderRadius: '12px', display: 'block' }}
          ></iframe>
      </div>
      <style jsx>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </div>
  );
}

// --- PAGE PRINCIPALE ---
export default function Docutheque() {
  const [films, setFilms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedFilm, setSelectedFilm] = useState(null);

  useEffect(() => {
    // REQUÊTE GROQ (Utilisation des noms anglais de ton schema)
    const query = `*[_type == "film"] | order(year desc) {
      _id, title, director, year, poster, youtubeId, collection
    }`;
    client.fetch(query).then((data) => { setFilms(data); setLoading(false); }).catch((err) => { console.error(err); setLoading(false); });
  }, []);

  // Filtrage
  const searchedFilms = films.filter(film =>
    film.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    film.director?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // SÉPARATION DES COLLECTIONS
  // 1. Les classiques ("pioneers")
  const classicFilms = searchedFilms.filter(film => film.collection === 'pioneers');
  // 2. Le reste ("focus" ou vide)
  const standardFilms = searchedFilms.filter(film => film.collection !== 'pioneers');

  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', paddingTop: '80px' }}>
      <Header />

      {selectedFilm && <VideoPlayerModal film={selectedFilm} onClose={() => setSelectedFilm(null)} />}

      <section style={{ padding: '0 5%' }}>
        
        {/* EN-TÊTE PAGE */}
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            marginBottom: '40px', 
            marginTop: '60px'
        }}>
          <img 
            src="/images/logo-docutheque.png" 
            alt="La Docuthèque" 
            style={{ 
                height: '100px',
                width: 'auto', 
                marginBottom: '20px' 
            }} 
          />
          
          <input
            type="text"
            placeholder="Rechercher un film, un réalisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%', maxWidth: '400px', padding: '10px 20px',
              borderRadius: '50px', border: '1px solid #33a002',
              fontFamily: 'var(--font-titles)', fontSize: '0.9rem', outline: 'none', textAlign: 'center', 
              backgroundColor: '#fff', color: '#1a1a1a'
            }}
          />
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', fontFamily: 'var(--font-titles)', color: '#666' }}>Chargement...</p>
        ) : (
          <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '80px' }}>
            
            {/* --- SECTION 1 : SÉLECTION FOCUS --- */}
            {standardFilms.length > 0 && (
              <div style={{ marginBottom: '60px' }}>
                <h2 style={{ 
                  fontFamily: 'var(--font-bebas)', fontSize: '2rem', color: '#1a1a1a', 
                  borderBottom: '2px solid #33a002', paddingBottom: '5px', marginBottom: '25px', display: 'inline-block'
                }}>
                  SÉLECTION <span style={{ color: '#33a002' }}>FOCUS</span>
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '25px'
                }}>
                  {standardFilms.map(film => (
                    <FilmCard key={film._id} film={film} onClick={setSelectedFilm} />
                  ))}
                </div>
              </div>
            )}

            {/* --- SECTION 2 : LES PIONNIERS (STYLE MODIFIÉ) --- */}
            {classicFilms.length > 0 && (
              <div style={{ 
                // MODIF 1: Fond plus clair et transparent (RGBA)
                backgroundColor: 'rgba(84, 3, 3, 1)', 
                color: '#ffffff',
                // MODIF 2: Section plus large grâce aux marges négatives
                margin: '0 -40px',
                // Compensation du padding interne pour que le contenu reste centré
                padding: '50px 60px', 
                borderRadius: '20px', // Un peu plus arrondi pour la modernité
                border: '1px solid rgba(255,255,255,0.1)', // Bordure subtile
                boxShadow: '0 15px 40px rgba(0,0,0,0.3)', // Ombre plus douce
                position: 'relative', zIndex: 1
              }}>
                 <h2 style={{ 
                  fontFamily: 'var(--font-bebas)', 
                  fontSize: '2.5rem', 
                  color: '#ffffff',
                  margin: '0 0 10px 0', 
                  lineHeight: 1,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  LES <span style={{ color: '#33a002' }}>PIONNIERS</span>
                </h2>
                <p style={{ 
                  fontFamily: 'var(--font-montserrat)', 
                  color: '#e0e0e0', // Gris très clair
                  fontSize: '0.95rem', 
                  marginBottom: '30px', 
                  maxWidth: '600px',
                  lineHeight: '1.6'
                }}>
                  Découvrez ou redécouvrez des documentaires classiques.
                </p>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '25px'
                }}>
                  {classicFilms.map(film => (
                    <FilmCard key={film._id} film={film} onClick={setSelectedFilm} />
                  ))}
                </div>
              </div>
            )}

            {/* Message si rien trouvé */}
            {films.length > 0 && searchedFilms.length === 0 && (
              <p style={{ textAlign: 'center', fontFamily: 'var(--font-titles)', color: '#999' }}>Aucun film ne correspond à votre recherche.</p>
            )}

          </div>
        )}
      </section>
    </main>
  );
}