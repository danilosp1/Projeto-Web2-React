const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function fetchFromApi(
  endpoint: string,
  params: Record<string, any> = {}
) {
  let url = `${BASE_URL}${endpoint}?api_key=${API_KEY}&language=pt-BR`;

  Object.keys(params).forEach((key) => {
    url = `${url}&${key}=${params[key]}`;
  });


  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.statusText}`);
  }
  return response.json();
}

export function fetchPopularMovies() {
  return fetchFromApi("/movie/popular");
}

export function fetchPopularTVShows() {
  return fetchFromApi("/tv/popular");
}

export function fetchMoviesByGenre(genreId: number) {
  return fetchFromApi("/discover/movie", { with_genres: genreId });
}

export function fetchTVByGenre(genreId: number) {
  return fetchFromApi("/discover/tv", { with_genres: genreId });
}

export function searchMulti(query: string) {
  return fetchFromApi("/search/multi", { query });
}

export function fetchDetails(id: string, type: string) {
  return fetchFromApi(`/${type}/${id}`);
}

export function fetchTrailer(id: string, type: string) {
  return fetchFromApi(`/${type}/${id}/videos`).then((data) => {
    return data.results.find(
      (video: any) => video.type === "Trailer" && video.site === "YouTube"
    );
  });
}
