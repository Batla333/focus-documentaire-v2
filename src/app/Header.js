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
      // MODIF : Padding un peu plus généreux pour le grand logo
      padding: '10px 5%', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderBottom: '3px solid #1a1a1a',
      // MODIF : On augmente la hauteur de la barre pour loger le logo (100px)
      height: '100px' 
    }}>
      
      {/* --- VOS STYLES INCHANGÉS --- */}
      <style>{`
        .nav-link {
          position: relative;
          text-decoration: none;
          color: #1a1a1a;
          font-family: var(--font-bebas);
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
          padding: 10px 25px; 
          border: 3px solid #1a1a1a; 
          color: #1a1a1a;
          font-family: var(--font-bebas);
          font-size: 1.6rem; 
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
          // MODIFICATION ICI : On passe à 75px (au lieu de 50px)
          style={{ width: 'auto', height: '75px' }} 
        />
      </Link>

      {/* 2. NAVIGATION INCHANGÉE */}
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