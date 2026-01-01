import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function BannerDocutheque() {
  return (
    // CHANGEMENT ICI :
    // margin: '100px 0 50px 0' signifie : 
    // 100px en haut (pour l'écart avec le slider)
    // 0px à droite
    // 50px en bas (pour l'écart avec la suite)
    // 0px à gauche
    <section style={{ width: '100%', margin: '100px 0 50px 0' }}>
      
      <Link href="/docutheque" className="docu-banner">
        
        {/* --- STYLES CSS --- */}
        <style>{`
          .docu-banner {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 400px;
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
          }

          .docu-banner:hover .logo-wrapper {
            transform: scale(1.02);
          }

          .banner-text {
            color: #ffffff;
            font-family: Arial, sans-serif;
            font-size: 1.2rem;
            font-weight: 500;
            margin-top: 20px;
            white-space: nowrap; 
            max-width: 100%;     
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
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
            style={{ width: 'auto', height: 'auto', maxHeight: '130px' }}
          />
          
          <p className="banner-text">
            Découvrez une sélection de films documentaires étudiants, amateurs et professionnels, gratuitement.
          </p>
        </div>

      </Link>
    </section>
  );
}