import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      boxSizing: 'border-box', 
      zIndex: 100, 
      // Padding réduit (15px au lieu de 35px) pour un header moins "haut"
      padding: '15px 5%', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      
      // 1. Fond blanc très légèrement transparent (0.95)
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      
      // 2. Ligne noire solide en bas pour bien délimiter
      // Si tu préfères le vert, remplace #1a1a1a par #33a002
      borderBottom: '3px solid #1a1a1a' 
    }}>
      
      {/* --- STYLES CSS --- */}
      <style>{`
        .nav-link {
          position: relative;
          text-decoration: none;
          color: #1a1a1a;
          font-family: var(--font-bebas);
          /* Police plus grosse (1.6rem) pour mettre en avant */
          font-size: 1.6rem; 
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
          height: 3px; /* Soulignement un peu plus épais */
          bottom: -5px;
          left: 0;
          background-color: #33a002;
          transition: width 0.3s ease;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .btn-docutheque {
          padding: 10px 25px; /* Bouton un peu plus grand */
          border: 3px solid #1a1a1a; /* Bordure plus épaisse */
          color: #1a1a1a;
          font-family: var(--font-bebas);
          font-size: 1.6rem; /* Texte plus gros */
          text-decoration: none;
          transition: all 0.3s ease;
          background: transparent;
        }

        .btn-docutheque:hover {
          background-color: #1a1a1a;
          color: #fff;
          border-color: #1a1a1a;
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
          // On garde ta contrainte de 90px de haut
          style={{ width: 'auto', height: '90px' }} 
        />
      </Link>

      {/* 2. NAVIGATION */}
      <nav style={{ display: 'flex', gap: '50px', alignItems: 'center' }}>
        
        <Link href="/article" className="nav-link">
          ARTICLES
        </Link>
        
        <Link href="/docutheque" className="btn-docutheque">
          LA DOCUTHÈQUE
        </Link>
        
        <Link href="/contact" className="nav-link">
          CONTACT
        </Link>

      </nav>
    </header>
  );
}