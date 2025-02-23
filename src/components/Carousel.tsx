import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

type Item = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  media_type?: string;
};

type CarouselProps = {
  title: string;
  items: Item[];
};

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const Carousel: React.FC<CarouselProps> = ({ title, items }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: number) => {
    if (containerRef.current) {
      const cardWidth = containerRef.current.querySelector('.carousel-card')?.clientWidth || 0;
      const gap = 16; // aproximadamente 1rem = 16px
      containerRef.current.scrollBy({
        left: (cardWidth + gap) * direction,
        behavior: "smooth",
      });
    }
  };

  return (
    <section style={{ width: '100%' }}>
      {title && <h2 className="section-title">{title}</h2>}
      <div style={{ position: 'relative' }}>
        <button className="carousel-button left" onClick={() => scrollCarousel(-1)}>
          <span className="material-icons">chevron_left</span>
        </button>
        <div ref={containerRef} className="carousel-container">
          {items.map(item => {
            const type = item.media_type || (item.title ? "movie" : "tv");
            return (
              <div key={item.id} className="carousel-card">
                <img src={`${IMAGE_BASE_URL}${item.poster_path}`} alt={item.title || item.name} />
                <div className="carousel-overlay">
                  <Link to={`/details?id=${item.id}&type=${type}`} style={{ color: '#ffffff', background: '#dc2626', padding: '0.5rem 1rem', borderRadius: '9999px', textDecoration: 'none' }}>
                    Saiba Mais
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        <button className="carousel-button right" onClick={() => scrollCarousel(1)}>
          <span className="material-icons">chevron_right</span>
        </button>
      </div>
    </section>
  );
};

export default Carousel;
