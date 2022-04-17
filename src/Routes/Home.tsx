import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMovies } from "../api";
import MovieBanner from "../Components/Banner/MovieBanner";
import Slider from "../Components/movieSlider/Slider";
import TopMovieSlider from "../Components/movieSlider/TopMovieSlider";
import UpcomingSlider from "../Components/movieSlider/UpcomingSlider";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Sliders = styled.div`
  display: flex;
  flex-direction: column;
`;

function Home() {
  const { isLoading } = useQuery<IGetMovies>(
    ["movies", "nowPlaying"],
    getMovies
  );
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <MovieBanner />
          <Sliders>
            <Slider />
            <UpcomingSlider />
            <TopMovieSlider />
          </Sliders>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
