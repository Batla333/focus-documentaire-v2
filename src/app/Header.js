import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="main-header">
      
      {/* --- STYLES CSS LOCAUX --- */}
      <style>{`
        /* Styles de base (Ordinateur) */
        .main-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          box-sizing: border-box;
          z-index: 100;
          padding: 15px 5%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: rgba(255, 255, 255, 0.95);
          border-bottom: 3px solid #1a1a1a;
          height: 100px; /* Fixe sur ordi */
          transition: all 0.3s ease;
        }

        .main-nav {
          display: flex;
          gap: 50px;
          align-items: center;
        }

        .nav-link {
          position: relative;
          text-decoration: none;
          color: #1a1a1a;
          font-family: var(--font-bebas); 
          font-size: 1.5rem; 
          letter-spacing: 1px;
          padding: 5px 0;
          transition: color 0.3s ease;
        }

        .nav-link:hover {
          color: #33a002;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 3px; 
          bottom: -5px;
          left: 0;
          background-color: #33a002;
          transition: width 0.3s ease;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .btn-docutheque {
          padding: 8px 20px; 
          border: 2px solid #1a1a1a; 
          color: #1a1a1a;
          font-family: var(--font-bebas); 
          font-size: 1.5rem; 
          text-decoration: none;
          transition: all 0.3s ease;
          background: transparent;
        }

        .btn-docutheque:hover {
          background-color: #1a1a1a;
          color: #fff;
          border-color: #1a1a1a;
        }

        /* ========================================= */
        /* RESPONSIVE MOBILE (Téléphones)            */
        /* ========================================= */
        @media (max-width: 768px) {
          .main-header {
            height: auto; /* Libère la hauteur pour que le menu rentre */
            flex-direction: column; /* Empile le logo en haut, le menu en bas */
            padding: 15px;
          }

          .main-nav {
            margin-top: 15px; /* Espacement sous le logo */
            gap: 15px; /* Réduit l'espace entre les liens */
            flex-wrap: wrap; /* Permet aux liens de s'adapter si l'écran est très étroit */
            justify-content: center;
          }

          .nav-link, .btn-docutheque {
            font-size: 1.1rem; /* Textes plus petits sur téléphone */
          }

          .btn-docutheque {
            padding: 5px 12px; /* Bouton affiné */
          }

          .doc-quizz-nav-link img {
            height: 35px !important; /* Le mini logo du jeu un peu plus petit */
          }
        }
      `}</style>

      {/* 1. LOGO */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
        <Image 
          src="/images/logo.png" 
          alt="Focus Documentaire"
          className="focus-docutheque"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: 'auto', height: '70px', objectFit: 'contain' }} 
        />
      </Link>

      {/* 2. NAVIGATION */}
      <nav className="main-nav">
        
        <Link href="/article" className="nav-link">
          ARTICLES
        </Link>
        
        <Link href="/docutheque" className="btn-docutheque">
          LA DOCUTHÈQUE
        </Link>
        
        <Link href="/contact" className="nav-link">
          CONTACT
        </Link>

        <Link href="/jeu" className="doc-quizz-nav-link">
          <img 
            src="/images/doc-quizz-nav.png" 
            alt="Doc Quizz" 
            className="doc-quizz-nav-logo"
            style={{ height: '45px', width: 'auto', objectFit: 'contain' }} 
          />
        </Link>

      </nav>
    </header>
  );
}