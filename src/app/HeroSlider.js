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

  if (loading) return <div style={{ height: '500px', background: '#fff' }}></div>;

  return (
    <section className="hero-section">
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
                height: '65vh', 
                minHeight: '500px',
                backgroundImage: `url(${urlFor(slide.image).url()})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '60px 5%'
              }}>
                {/* Overlay pour lisibilité */}
                <div style={{ 
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  background: 'linear-gradient(transparent 60%, rgba(0,0,0,0.6) 100%)'
                }}></div>

                <div style={{ position: 'relative', zIndex: 2, color: '#fff' }}>
                  <h2 style={{ 
                    fontFamily: 'var(--font-bebas)', 
                    fontSize: '4rem', 
                    margin: 0, 
                    lineHeight: '0.9' 
                  }}>
                    {slide.title}
                  </h2>
                  <p style={{ 
                    fontFamily: 'var(--font-montserrat)', 
                    color: '#33a002', /* TON VERT */
                    fontSize: '1.2rem', 
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