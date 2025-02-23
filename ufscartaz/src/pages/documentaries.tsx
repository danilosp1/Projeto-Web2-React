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

const Documentaries: React.FC = () => {
  const [documentaries, setDocumentaries] = useState<Item[]>([]);

  useEffect(() => {
    fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=pt-BR&with_genres=99`)
      .then((response) => response.json())
      .then((data) => setDocumentaries(data.results))
      .catch((error) => console.error("Erro ao buscar documentários:", error));
  }, []);

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <section>
          <h2 className="section-title">Documentários</h2>
          {documentaries.length > 0 ? (
            <Carousel title="" items={documentaries} />
          ) : (
            <p>Carregando...</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Documentaries;
