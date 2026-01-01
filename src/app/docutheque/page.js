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

function getYoutubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// --- COMPOSANT CARTE FILM (Version Compacte) ---
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
        borderRadius: '12px', /* Arrondi réduit */
        overflow: 'hidden', 
        boxShadow: isHovered ? '0 15px 30px rgba(0,0,0,0.3)' : '0 8px 15px rgba(0,0,0,0.1)',
        transform: isHovered ? 'scale(1.03)' : 'scale(1)',
        transition: 'all 0.3s ease',
        backgroundColor: '#000'
      }}>
        {film.affiche && (
          <img 
            src={urlFor(film.affiche)} 
            alt={film.titre}
            style={{ 
              width: '100%', height: '100%', objectFit: 'cover', 
              transition: 'filter 0.3s ease',
              filter: isHovered ? 'brightness(0.3) blur(2px)' : 'brightness(1)' 
            }}
          />
        )}
        
        {/* Overlay avec infos - Tout est réduit ici */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '15px', textAlign: 'center',
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.3s ease',
        }}>
          <h3 style={{ 
            fontFamily: 'var(--font-bebas)', /* Montserrat Bold */
            fontWeight: '900',
            fontSize: '1.4rem', /* Était 2.5rem */
            margin: '0 0 5px 0', 
            lineHeight: '1.1', 
            color: '#fff', 
            textTransform: 'uppercase'
          }}>
            {film.titre}
          </h3>
          <p style={{ 
            fontFamily: 'var(--font-bebas)', 
            fontSize: '0.85rem', /* Réduit */
            color: '#33a002', 
            fontWeight: '700', 
            margin: 0, 
            textTransform: 'uppercase', 
            letterSpacing: '1px' 
          }}>
            {film.realisateur}
          </p>
          {film.anneeProduction && (
            <span style={{ display: 'block', fontFamily: 'var(--font-bebas)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginTop: '5px' }}>
              {film.anneeProduction}
            </span>
          )}
          <div style={{ 
            marginTop: '15px', 
            border: '1px solid #33a002', 
            padding: '6px 15px', 
            borderRadius: '50px', 
            color: '#fff', 
            fontFamily: 'var(--font-titles)', 
            fontSize: '0.8rem', /* Bouton plus discret */
            fontWeight: '700',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            Regarder
          </div>
        </div>
      </div>
    </div>
  );
}

// --- COMPOSANT PLAYER MODAL ---
function VideoPlayerModal({ film, onClose }) {
  if (!film) return null;
  const videoId = getYoutubeId(film.lienYoutubeComplet);

  return (
    <div 
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.95)', 
        zIndex: 11000, 
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.3s ease'
      }}
      onClick={onClose} 
    >
      <button 
        onClick={onClose}
        style={{
          position: 'absolute', top: '20px', right: '20px',
          background: 'none', border: 'none', color: 'white',
          fontSize: '2rem', /* Plus petit */
          cursor: 'pointer', fontFamily: 'sans-serif',
          zIndex: 11001
        }}
      >
        ✕
      </button>

      <div 
        style={{ width: '100%', maxWidth: '900px', aspectRatio: '16/9', position: 'relative', boxShadow: '0 0 50px rgba(0,0,0,0.5)' }}
        onClick={(e) => e.stopPropagation()} 
      >
        {videoId ? (
          <iframe 
            width="100%" height="100%" 
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`} 
            title={film.titre}
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            style={{ borderRadius: '12px', display: 'block' }}
          ></iframe>
        ) : (
          <p style={{ color: 'white', textAlign: 'center' }}>Vidéo non disponible</p>
        )}
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
    const query = `*[_type == "film"] | order(anneeProduction desc) {
      _id, titre, realisateur, anneeProduction, affiche, lienYoutubeComplet
    }`;
    client.fetch(query).then((data) => { setFilms(data); setLoading(false); }).catch((err) => { console.error(err); setLoading(false); });
  }, []);

  const filteredFilms = films.filter(film =>
    film.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    film.realisateur?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    // PaddingTop ajusté : 80px suffit car le header fait 65px
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', paddingTop: '80px' }}>
      <Header />

      {selectedFilm && (
        <VideoPlayerModal film={selectedFilm} onClose={() => setSelectedFilm(null)} />
      )}

      <section style={{ padding: '0 5%' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px', marginTop: '20px' }}>
          
          {/* Logo réduit (70px au lieu de 110px) */}
          <img 
            src="/images/logo-docutheque.png" 
            alt="La Docuthèque" 
            style={{ height: '70px', width: 'auto', marginBottom: '20px' }}
          />
          
          <input
            type="text"
            placeholder="Rechercher un film, un réalisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%', maxWidth: '400px', /* Barre plus étroite */
              padding: '10px 20px', /* Padding réduit */
              borderRadius: '50px', border: '1px solid #33a002',
              fontFamily: 'var(--font-titles)', fontSize: '0.9rem', 
              outline: 'none', textAlign: 'center', 
              backgroundColor: '#fff',
              color: '#1a1a1a',
              boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
            }}
          />
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', fontFamily: '8var(--font-titles)', color: '#666' }}>Chargement...</p>
        ) : (
          <div style={{
            display: 'grid',
            /* C'EST ICI QUE TOUT CHANGE : minmax(200px) au lieu de 300px -> Affiches plus petites */
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '25px', /* Espace réduit */
            paddingBottom: '80px',
            maxWidth: '1000px', /* On centre la grille pour ne pas qu'elle soit trop large sur grand écran */
            margin: '0 auto'
          }}>
            {filteredFilms.map(film => (
              <FilmCard 
                key={film._id} 
                film={film} 
                onClick={setSelectedFilm} 
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}