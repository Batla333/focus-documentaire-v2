'use client'
import { useState, useEffect } from 'react';
import { client } from '@/lib/sanity'; 
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import imageUrlBuilder from '@sanity/image-url';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source);
}

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.fetch(`*[_type == "slider"] | order(order asc)`)
      .then((data) => {
        setSlides(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Placeholder : On ajoute une marge en haut pour simuler la place du header
  if (loading) return <div style={{ marginTop: '65px', height: '400px', background: '#fff' }}></div>;

  return (
    // MODIF 1 : On pousse la section vers le bas (65px = hauteur du Header)
    <section className="hero-section" style={{ paddingTop: '65px' }}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        autoHeight={true}
        navigation={true}
        pagination={{ clickable: true }}
        style={{ width: '100%' }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide._id || index}>
            <Link href={slide.link || '#'} style={{ textDecoration: 'none' }}>
              <div style={{ 
                // MODIF 2 : Hauteur ajustée (55vh est un bon compromis)
                // L'image est maintenant entièrement visible sous le menu
                height: '55vh',      
                minHeight: '400px',
                
                backgroundImage: `url(${urlFor(slide.image).url()})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '30px 5%'
              }}>
                {/* Overlay */}
                <div style={{ 
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  background: 'linear-gradient(transparent 60%, rgba(0,0,0,0.6) 100%)'
                }}></div>

                <div style={{ position: 'relative', zIndex: 2, color: '#fff' }}>
                  <h2 style={{ 
                    fontFamily: 'var(--font-bebas)', 
                    fontSize: '2.5rem', /* Taille maîtrisée */
                    margin: 0, 
                    lineHeight: '0.9' 
                  }}>
                    {slide.title}
                  </h2>
                  <p style={{ 
                    fontFamily: 'var(--font-montserrat)', 
                    color: '#33a002',
                    fontSize: '1rem',
                    fontWeight: '700',
                    margin: '5px 0 0 0'
                  }}>
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}