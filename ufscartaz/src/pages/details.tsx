import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useSearchParams } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";
const PROFILE_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w185";

type DetailData = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  genres: { id: number; name: string }[];
  media_type?: string;
};

type Credits = {
  cast: any[];
  crew: any[];
};

const Details: React.FC = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const type = searchParams.get("type") || "movie";
  const [data, setData] = useState<DetailData | null>(null);
  const [certification, setCertification] = useState<string>("Não disponível");
  const [credits, setCredits] = useState<Credits>({ cast: [], crew: [] });
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      fetchDetails(id, type);
    }
  }, [id, type]);

  useEffect(() => {
    if (data) {
      const favs = getFavorites();
      setIsFavorite(favs.some((fav: any) => fav.id === data.id && fav.media_type === type));
    }
  }, [data, type]);

  const fetchDetails = async (id: string, type: string) => {
    try {
      const response = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=pt-BR`);
      const detailData = await response.json();
      setData({ ...detailData, media_type: type });
      setBackground(detailData.backdrop_path);
      fetchAdditionalDetails(id, type);
      fetchCredits(id, type);
      fetchTrailer(id, type);
    } catch (error) {
      console.error("Erro ao buscar detalhes:", error);
    }
  };

  const setBackground = (backdropPath: string) => {
    if (backdropPath) {
      document.body.style.backgroundImage = `url(${IMAGE_BASE_URL}${backdropPath})`;
    }
  };

  const fetchAdditionalDetails = async (id: string, type: string) => {
    try {
      const endpoint = type === "movie" ? "release_dates" : "content_ratings";
      const response = await fetch(`${BASE_URL}/${type}/${id}/${endpoint}?api_key=${API_KEY}&language=pt-BR`);
      const data = await response.json();
      const info = data.results.find((entry: any) => entry.iso_3166_1 === "BR");

      setCertification(
        type === "movie"
          ? info?.release_dates[0]?.certification || "Não disponível"
          : info?.rating || "Não disponível"
      );
    } catch (error) {
      console.error("Erro ao buscar classificação indicativa:", error);
    }
  };

  const fetchCredits = async (id: string, type: string) => {
    try {
      const response = await fetch(`${BASE_URL}/${type}/${id}/credits?api_key=${API_KEY}&language=pt-BR`);
      const data = await response.json();
      setCredits(data);
    } catch (error) {
      console.error("Erro ao buscar créditos:", error);
    }
  };

  const fetchTrailer = async (id: string, type: string) => {
    try {
      const response = await fetch(`${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}&language=pt-BR`);
      const data = await response.json();
      const trailer = data.results.find((video: any) => video.type === "Trailer" && video.site === "YouTube");
      setTrailerUrl(trailer ? `https://www.youtube.com/embed/${trailer.key}` : null);
    } catch (error) {
      console.error("Erro ao buscar trailer:", error);
    }
  };

  const getDirector = () => credits.crew.find((member: any) => member.job === "Director");

  const getFavorites = () => {
    const favs = localStorage.getItem('favorites');
    return favs ? JSON.parse(favs) : [];
  };

  const saveFavorites = (favorites: any[]) => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  };

  const toggleFavorite = () => {
    if (!data) return;
    const favs = getFavorites();
    const exists = favs.find((fav: any) => fav.id === data.id && fav.media_type === type);
    let newFavs;

    if (exists) {
      // Remove dos favoritos
      newFavs = favs.filter((fav: any) => !(fav.id === data.id && fav.media_type === type));
      setIsFavorite(false);
    } else {
      // Adiciona aos favoritos
      const newFav = {
        id: data.id,
        media_type: type,
        title: data.title || data.name,
        poster_path: data.poster_path,
      };
      newFavs = [...favs, newFav];
      setIsFavorite(true);
    }
    saveFavorites(newFavs);
  };

  if (!data)
    return (
      <div className="app-container">
        <Header />
        <p>Carregando...</p>
      </div>
    );

  const title = data.title || data.name;
  const releaseDate = data.release_date! || data.first_air_date!;
  const genres = data.genres.map((genre) => genre.name).join(", ");
  const director = getDirector();

  return (
    <div className="detail-page">
      <Header />
      <div className="detail-container">
        <a href="/" className="detail-back">
          <span className="material-icons detail-back-icon">chevron_left</span>
          <p className="detail-back-text">Voltar</p>
        </a>
        <button className="favorite-button" onClick={toggleFavorite}>
          {isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
        </button>
        <div className="detail-main">
          <img className="detail-poster" src={`${IMAGE_BASE_URL}${data.poster_path}`} alt={title} />
          <div className="detail-info">
            <h1 className="detail-title">{title}</h1>
            <p className="detail-overview">{data.overview}</p>
            <p className="subinfo">
              {type === "movie" ? "Lançamento" : "Primeira exibição"}:{" "}
              {new Date(releaseDate).toLocaleDateString()}
            </p>
            <p className="subinfo">Avaliação: {data.vote_average}</p>
            <p className="subinfo">Categoria: {genres}</p>
            <p className="subinfo">Classificação indicativa: {certification}</p>
          </div>
        </div>
        {trailerUrl ? (
          <div className="detail-trailer">
            <h2 className="detail-trailer-title">Assista ao trailer</h2>
            <iframe
              className="detail-iframe"
              src={trailerUrl}
              title={`Trailer de ${title}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <p className="detail-no-trailer">Trailer não disponível.</p>
        )}
        <div className="detail-director">
          <h2 className="detail-section-title">Diretor</h2>
          {director ? (
            <div className="director-info">
              <img
                className="director-photo"
                src={`${PROFILE_IMAGE_BASE_URL}${director.profile_path}`}
                alt={director.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/default-profile.png';
                }}
              />
              <p className="director-name">{director.name}</p>
              <p className="director-role">(Diretor)</p>
            </div>
          ) : (
            <p className="no-director">Diretor não encontrado.</p>
          )}
        </div>
        <div className="detail-cast">
          <h2 className="detail-section-title">Elenco</h2>
          <div className="detail-grid">
            {credits.cast.slice(0, 10).map((actor: any) => (
              <div key={actor.id} className="cast-member">
                <img
                  className="cast-photo"
                  src={`${PROFILE_IMAGE_BASE_URL}${actor.profile_path}`}
                  alt={actor.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/images/default-profile.png';
                  }}
                />
                <p className="cast-name">{actor.name}</p>
                <p className="cast-character">({actor.character})</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
