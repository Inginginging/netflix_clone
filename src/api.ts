const API_KEY = "0acf5518da5cf20a97431c9a5510b8c5";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}
interface IGenres {
  id: number;
  name: string;
}

export interface IGetMovies {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}
export interface IMovieDetail {
  adult: boolean;
  backdrop_path: string;
  overview: string;
  original_title: string;
  poster_path: string;
  release_date: string;
  runtime: number;
  vote_average: number;
  genres: IGenres[];
}

export const getMovies = () => {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());
};
export const getUpcomingMovies = () => {
  return fetch(
    `${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&language=ko-KR&page=2`
  ).then((response) => response.json());
};
export const getTopMovies = () => {
  return fetch(
    `${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=ko-KR&page=2`
  ).then((response) => response.json());
};
export const getMovieDetail = (movieId?: string) => {
  return fetch(
    `${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());
};

//tv
export function getTvDetail(tvId: string) {
  return fetch(
    `${BASE_PATH}/tv/${tvId}?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());
}
