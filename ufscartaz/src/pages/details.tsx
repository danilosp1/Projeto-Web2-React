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

  useEffect(() => {
    if (id) {
      fetchDetails(id, type);
    }
  }, [id, type]);

  const fetchDetails = async (id: string, type: string) => {
    try {
      const response = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=pt-BR`);
      const detailData = await response.json();
      setData(detailData);
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
      if (type === "movie") {
        const response = await fetch(`${BASE_URL}/movie/${id}/release_dates?api_key=${API_KEY}&language=pt-BR`);
        const data = await response.json();
        const releaseInfo = data.results.find((entry: any) => entry.iso_3166_1 === "BR");
        setCertification(releaseInfo?.release_dates[0]?.certification || "Não disponível");
      } else if (type === "tv") {
        const response = await fetch(`${BASE_URL}/tv/${id}/content_ratings?api_key=${API_KEY}&language=pt-BR`);
        const data = await response.json();
        const ratingInfo = data.results.find((entry: any) => entry.iso_3166_1 === "BR");
        setCertification(ratingInfo?.rating || "Não disponível");
      }
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

  if (!data) return <div className="app-container"><Header /><p>Carregando...</p></div>;

  const title = data.title || data.name;
  const releaseDate = data.release_date! || data.first_air_date!;
  const genres = data.genres.map((genre) => genre.name).join(", ");
  const director = getDirector();

  return (
    <div className="detail-page">
      <div id="blur-overlay"></div>
      <Header />
      <div className="detail-container">
        <a href="/" className="detail-back">
          <span className="material-icons detail-back-icon">chevron_left</span>
          <p className="detail-back-text">Voltar</p>
        </a>
        <div className="detail-main">
          <img className="detail-poster" src={`${IMAGE_BASE_URL}${data.poster_path}`} alt={title} />
          <div className="detail-info">
            <h1 className="detail-title">{title}</h1>
            <p className="detail-overview">{data.overview}</p>
            <p className="subinfo">{type === "movie" ? "Lançamento" : "Primeira exibição"}: {new Date(releaseDate).toLocaleDateString()}</p>
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
