"use client";
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Styles pour les liens
  const linkStyle = {
    color: '#999', // Gris clair
    textDecoration: 'none',
    fontFamily: 'var(--font-montserrat)',
    fontSize: '0.9rem',
    marginBottom: '12px',
    display: 'block',
    transition: 'color 0.3s'
  };

  // Fonctions pour gérer le survol
  const handleHover = (e) => e.target.style.color = '#33a002';
  const handleLeave = (e) => e.target.style.color = '#999';

  const titleStyle = {
    color: '#fff',
    fontFamily: 'var(--font-bebas)', // Utilise la police Antonio
    fontWeight: '300', 
    fontSize: '1.6rem',
    marginBottom: '25px',
    letterSpacing: '1px'
  };

  return (
    <footer style={{ backgroundColor: '#111', color: 'white', paddingTop: '70px', marginTop: 'auto' }}>
      
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 5%', 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'center', 
        gap: '80px', 
        paddingBottom: '60px' 
      }}>

        {/* COLONNE 1 : LOGO & DESCRIPTION */}
        <div style={{ flex: '1 1 300px', maxWidth: '400px', marginBottom: '30px', textAlign: 'center' }}>
          <img 
            src="/images/logo.png" 
            alt="Focus Documentaire" 
            style={{ height: '70px', width: 'auto', marginBottom: '25px', margin: '0 auto' }} 
          />
          <img 
            src="/images/logo-docutheque.png" 
            alt="Focus Documentaire" 
            style={{ height: '70px', width: 'auto', marginBottom: '25px', margin: '0 auto' }} 
          />
          <p style={{ fontFamily: 'var(--font-montserrat)', color: '#888', fontSize: '0.95rem', lineHeight: '1.7' }}>
            Une plateforme dédiée au cinéma documentaire.
          </p>
        </div>

        {/* COLONNE 2 : NAVIGATION */}
        <div style={{ flex: '0 1 200px', marginBottom: '30px', textAlign: 'center' }}>
          <h4 style={titleStyle}>EXPLORER</h4>
          <nav style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Link href="/" style={linkStyle} onMouseEnter={handleHover} onMouseLeave={handleLeave}>Accueil</Link>
            <Link href="/docutheque" style={linkStyle} onMouseEnter={handleHover} onMouseLeave={handleLeave}>La Docuthèque</Link>
            <Link href="/article" style={linkStyle} onMouseEnter={handleHover} onMouseLeave={handleLeave}>Articles</Link>
            <Link href="/contact" style={linkStyle} onMouseEnter={handleHover} onMouseLeave={handleLeave}>Proposer un film</Link>
            
          </nav>
        </div>

        {/* COLONNE 3 : CONTACT & SOCIAL */}
        <div style={{ flex: '0 1 250px', marginBottom: '30px', textAlign: 'center' }}>
          <h4 style={titleStyle}>NOUS SUIVRE</h4>
          
          <p style={{ marginBottom: '20px', fontFamily: 'var(--font-montserrat)', color: '#999' }}>
            Une question ?<br/>
            <a href="mailto:contact@focusdocumentaire.com" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#33a002'} onMouseLeave={(e) => e.target.style.color = '#fff'}>
              contact@focusdocumentaire.com
            </a>
          </p>
          
          {/* Réseau Social : X */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '25px' }}>
            <a 
              href="https://x.com/focus_doc" 
              target="_blank" 
              aria-label="X (Twitter)" 
              style={{ color: 'white', transition: 'transform 0.3s, color 0.3s' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#33a002'; e.currentTarget.style.transform = 'scale(1.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>

      </div>

      {/* BANDEAU DU BAS */}
      <div style={{ backgroundColor: '#0a0a0a', padding: '25px 5%', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.85rem', color: '#555', margin: 0 }}>
          © {currentYear} Focus Documentaire. Tous droits réservés. 
          <span style={{ margin: '0 15px', color: '#333' }}>|</span> 
          <Link href="/mentions-legales" style={{ color: '#777', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={handleHover} onMouseLeave={(e) => e.target.style.color = '#777'}>
            Mentions Légales
          </Link>
        </p>
      </div>
    </footer>
  );
}