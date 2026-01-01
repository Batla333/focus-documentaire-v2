import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function BannerDocutheque() {
  return (
    // CHANGEMENT : Marges verticales réduites (60px et 30px) pour l'aspect compact
    // Width 100% assure que ça touche les bords (si placé hors d'un conteneur avec padding)
    <section style={{ width: '100%', margin: '60px 0 30px 0' }}>
      
      <Link href="/docutheque" className="docu-banner">
        
        {/* --- STYLES CSS --- */}
        <style>{`
          .docu-banner {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            /* MODIFICATION : Hauteur réduite de 400px à 300px */
            height: 300px;
            text-decoration: none;
            overflow: hidden;
          }

          .docu-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('/images/fond-docu.png');
            background-size: cover;
            background-position: center;
            transition: transform 0.5s ease, filter 0.3s ease;
            z-index: 1;
            filter: brightness(0.9);
          }

          .docu-banner:hover .docu-background {
            transform: scale(1.05);
            filter: brightness(0.7);
          }

          .logo-wrapper {
            position: relative;
            z-index: 2;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            width: 100%; 
            transition: transform 0.3s ease;
            padding: 0 20px; /* Sécurité pour pas que le texte touche les bords sur mobile */
          }

          .docu-banner:hover .logo-wrapper {
            transform: scale(1.02);
          }

          .banner-text {
            color: #ffffff;
            /* MODIFICATION : On garde Arial, mais on réduit la taille (1rem) */
            font-family: Arial, sans-serif;
            font-size: 1rem; 
            font-weight: 500;
            margin-top: 15px;
            /* On enlève le white-space nowrap pour éviter les soucis sur mobile si le texte est long */
            max-width: 600px;     
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
            line-height: 1.5;
          }
        `}</style>

        {/* Image de fond */}
        <div className="docu-background"></div>

        {/* Contenu */}
        <div className="logo-wrapper">
          <Image 
            src="/images/logo-docutheque.png" 
            alt="Focus Docuthèque"
            width={300}  
            height={100} 
            // MODIFICATION : Logo réduit (maxHeight 80px au lieu de 130px)
            style={{ width: 'auto', height: 'auto', maxHeight: '80px' }}
          />
          
          <p className="banner-text">
            Découvrez une sélection de films documentaires étudiants, amateurs et professionnels, gratuitement.
          </p>
        </div>

      </Link>
    </section>
  );
}