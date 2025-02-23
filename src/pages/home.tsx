import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Carousel from '../components/Carousel';
import {
  fetchPopularMovies,
  fetchPopularTVShows,
  fetchFromApi,
  fetchMoviesByGenre,
} from '../services/api';

type Item = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  media_type?: string;
  vote_average?: number;
  popularity?: number;
};

const Home: React.FC = () => {
  const [popularContent, setPopularContent] = useState<Item[]>([]);
  const [recommendedContent, setRecommendedContent] = useState<Item[]>([]);
  const [popularMovies, setPopularMovies] = useState<Item[]>([]);
  const [popularSeries, setPopularSeries] = useState<Item[]>([]);
  const [documentaries, setDocumentaries] = useState<Item[]>([]);

  useEffect(() => {
    const fetchPopularContentData = async () => {
      try {
        const [moviesData, tvData] = await Promise.all([
          fetchPopularMovies(),
          fetchPopularTVShows(),
        ]);
        const combined = [...moviesData.results, ...tvData.results];
        combined.sort((a: Item, b: Item) => (b.popularity || 0) - (a.popularity || 0));
        setPopularContent(combined);
      } catch (error) {
        console.error("Erro ao buscar conteúdo popular:", error);
      }
    };

    const fetchRecommendedContentData = async () => {
      try {
        const [moviesTopRated, tvTopRated] = await Promise.all([
          fetchFromApi("/movie/top_rated"),
          fetchFromApi("/tv/top_rated"),
        ]);
        const combined = [...moviesTopRated.results, ...tvTopRated.results];
        combined.sort((a: Item, b: Item) => (b.vote_average || 0) - (a.vote_average || 0));
        setRecommendedContent(combined);
      } catch (error) {
        console.error("Erro ao buscar conteúdo recomendado:", error);
      }
    };

    const fetchPopularMoviesData = async () => {
      try {
        const moviesData = await fetchPopularMovies();
        setPopularMovies(moviesData.results);
      } catch (error) {
        console.error("Erro ao buscar filmes populares:", error);
      }
    };

    const fetchPopularSeriesData = async () => {
      try {
        const tvData = await fetchPopularTVShows();
        setPopularSeries(tvData.results);
      } catch (error) {
        console.error("Erro ao buscar séries populares:", error);
      }
    };

    const fetchDocumentariesData = async () => {
      try {
        const documentariesData = await fetchMoviesByGenre(99);
        setDocumentaries(documentariesData.results);
      } catch (error) {
        console.error("Erro ao buscar documentários:", error);
      }
    };

    fetchPopularContentData();
    fetchRecommendedContentData();
    fetchPopularMoviesData();
    fetchPopularSeriesData();
    fetchDocumentariesData();
  }, []);

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Carousel title="Populares" items={popularContent} />
        <Carousel title="Você pode gostar" items={recommendedContent} />
        <Carousel title="Filmes Populares" items={popularMovies} />
        <Carousel title="Séries Populares" items={popularSeries} />
        <Carousel title="Documentários" items={documentaries} />
      </main>
    </div>
  );
};

export default Home;
