import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMovies, IGetMovies } from "../api";
import MovieBanner from "../Components/Banner/MovieBanner";
import Detail from "../Components/Detail";
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
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  opacity: 0;
`;
const BigBox = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
`;

function Home() {
  const { isLoading } = useQuery<IGetMovies>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const navigate = useNavigate();
  const movieMatch = useMatch("/movies/:movieId"); //어느 movie가 click되었나 obj를 반환해주는 hook
  const { scrollY } = useViewportScroll(); //bigBox의 위치를 항상 정가운데에 놓기위한 변수
  const onOverlayClick = () => {
    navigate("/"); //다시 home으로 변경
  };
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
          <AnimatePresence>
            {movieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigBox
                  style={{ top: scrollY.get() + 50 }}
                  layoutId={movieMatch.params.movieId}
                >
                  <Detail />
                </BigBox>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
