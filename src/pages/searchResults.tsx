import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useSearchParams } from 'react-router-dom';

type Item = {
  id: number;
  media_type: string;
  title?: string;
  name?: string;
  poster_path: string | null;
};

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [results, setResults] = useState<Item[]>([]);

  useEffect(() => {
    if (query) {
      fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}`)
        .then((response) => response.json())
        .then((data) => {
          const filtered = data.results.filter((item: any) => item.media_type === "movie" || item.media_type === "tv");
          setResults(filtered);
        })
        .catch((error) => console.error("Erro ao buscar resultados:", error));
    }
  }, [query]);

  return (
    <div className="app-container">
      <Header />
      <main className="main-content main-search-results">
        <h1 style={{ fontSize: "2rem", color: "#fff" }}>
          Resultados da busca para: <span style={{ fontWeight: "bold" }}>{query}</span>
        </h1>
        <div className="results-grid">
          {results.length > 0 ? (
            results.map((item) => {
              const title = item.media_type === "movie" ? item.title : item.name;
              const image = item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : "/assets/images/placeholder.png";
              const link = `/details?id=${item.id}&type=${item.media_type}`;
              return (
                <div key={item.id} className="carousel-card">
                  <img src={image} alt={title} />
                  <div className="carousel-overlay">
                    <a
                      href={link}
                      style={{
                        color: "#fff",
                        background: "#dc2626",
                        padding: "0.5rem 1rem",
                        borderRadius: "9999px",
                        textDecoration: "none",
                      }}
                    >
                      Saiba mais
                    </a>
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ gridColumn: "span 6", textAlign: "center", fontSize: "1.25rem", color: "#fff" }}>
              Nenhum resultado encontrado
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchResults;
