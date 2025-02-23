import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Carousel from '../components/Carousel';

type Item = {
  id: number;
  name?: string;
  poster_path: string;
};

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

const genres = [
  { id: 18, title: 'Drama' },
  { id: 35, title: 'Comédia' },
  { id: 9648, title: 'Mistério' },
  { id: 10759, title: 'Ação e Aventura' },
];

const Series: React.FC = () => {
  const [genreItems, setGenreItems] = useState<{ [key: number]: Item[] }>({});

  useEffect(() => {
    genres.forEach((genre) => {
      fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&language=pt-BR&with_genres=${genre.id}`)
        .then((response) => response.json())
        .then((data) => setGenreItems((prev) => ({ ...prev, [genre.id]: data.results })))
        .catch((error) =>
          console.error(`Erro ao buscar séries do gênero ${genre.title}:`, error)
        );
    });
  }, []);

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        {genres.map((genre) => (
          <section key={genre.id}>
            <h2 className="section-title">{genre.title}</h2>
            {genreItems[genre.id] ? (
              <Carousel title="" items={genreItems[genre.id]} />
            ) : (
              <p>Carregando...</p>
            )}
          </section>
        ))}
      </main>
    </div>
  );
};

export default Series;
