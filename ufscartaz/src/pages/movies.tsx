import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Carousel from '../components/Carousel';

type Item = {
  id: number;
  title?: string;
  poster_path: string;
};

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

const genres = [
  { id: 28, title: 'Ação' },
  { id: 35, title: 'Comédia' },
  { id: 18, title: 'Drama' },
  { id: 27, title: 'Terror' },
];

const Movies: React.FC = () => {
  const [genreItems, setGenreItems] = useState<{ [key: number]: Item[] }>({});

  useEffect(() => {
    genres.forEach((genre) => {
      fetch(
        `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=pt-BR&with_genres=${genre.id}`
      )
        .then((response) => response.json())
        .then((data) => {
          setGenreItems((prev) => ({ ...prev, [genre.id]: data.results }));
        })
        .catch((error) =>
          console.error(`Erro ao buscar filmes do gênero ${genre.title}:`, error)
        );
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[url('/assets/images/bg-image.jpg')] bg-no-repeat bg-cover backdrop-blur-xl backdrop-brightness-75 overflow-x-hidden overflow-y-auto">
      <Header />
      <main className="main-content">
        {genres.map((genre) => (
          <section key={genre.id} className="w-full">
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

export default Movies;
