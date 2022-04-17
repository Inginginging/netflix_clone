import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getTopMovies, IGetMovies } from "../../api";
import { makeImgPath } from "../../utils";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

const Wrapper = styled.div`
  position: relative;
  top: -100px;
`;
const Row = styled(motion.div)`
  position: absolute;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 5px;
  width: 100%;
`;
const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 250px;
  font-size: 40px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  width: 100%;
  position: absolute;
  bottom: -35px;
  opacity: 0;
  h4 {
    font-size: 16px;
    text-align: center;
  }
`;
const Arrow = styled.div`
  position: absolute;
  top: 0;
  display: flex;
  width: 100%;
`;
const Right = styled(motion.div)`
  width: 40px;
  height: 250px;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 0;
  cursor: pointer;
  svg {
    width: 30px;
    height: 30px;
    color: white;
  }
`;
const Left = styled(motion.div)`
  width: 40px;
  height: 250px;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  cursor: pointer;
  svg {
    width: 30px;
    height: 30px;
    color: white;
  }
`;
const SliderTitle = styled.span`
  font-size: 26px;
  font-weight: 400;
  padding-left: 10px;
  position: absolute;
  top: -40px;
`;
const BigBox = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: 99;
  background-color: ${(props) => props.theme.black.lighter};
`;
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  opacity: 0;
`;
const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;
const MovieInfo = styled.div`
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
`;
const BigTitle = styled.h2`
  font-size: 46px;
  font-weight: 450;
  margin-bottom: 10px;
`;
const BigOverview = styled.p`
  font-size: 18px;
`;

const rowVariants = {
  initial: (back: boolean) => ({
    x: back ? -window.innerWidth : window.innerWidth,
  }),
  animate: { x: 0 },
  exit: (back: boolean) => ({
    x: back ? window.innerWidth : -window.innerWidth,
  }),
};
const boxVariants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};
const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const offset = 9;

function TopMovieSlider() {
  const { data } = useQuery<IGetMovies>(["movies", "topRated"], getTopMovies);
  //row의 index를 관찰하는 state
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false); //slider가 움직이는 상태인지 확인하는 state
  const [back, setBack] = useState(false);
  const navigate = useNavigate();
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return; //slider가 움직이고 있으면 index를 increase하지 않음
      toggleLeaving(); //slider가 움직이지 않은 상태면 leaving state를 true로 toggle
      setBack(false);
      const totalMovies = data.results.length - 1; //첫번째 movie는 대문 poster로 사용
      const maxPage = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxPage ? 0 : prev + 1)); //maxpage이면 다시 처음으로 회귀
    }
  };
  const decreaseIndex = () => {
    if (data) {
      if (leaving) return; //slider가 움직이고 있으면 index를 increase하지 않음
      toggleLeaving(); //slider가 움직이지 않은 상태면 leaving state를 true로 toggle
      setBack(true);
      const totalMovies = data.results.length - 1; //첫번째 movie는 대문 poster로 사용
      const maxPage = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxPage : prev - 1)); //maxpage이면 다시 처음으로 회귀
    }
  };
  const onBoxClick = (movieId: number) => {
    navigate(`movies/${movieId}`); //navigate를 사용하여 현재 url을 변경
  };
  //Bigbox func
  const movieMatch = useMatch("/movies/:movieId"); //어느 movie가 click되었나 obj를 반환해주는 hook
  const { scrollY } = useViewportScroll(); //bigBox의 위치를 항상 정가운데에 놓기위한 변수
  const onOverlayClick = () => {
    navigate("/"); //다시 home으로 변경
  };
  //click한 movie와 받아온 data의 movie들 중 동일한 id의 movie 찾음.
  const clickedMovie =
    movieMatch?.params.movieId &&
    data?.results.find(
      (movie) => String(movie.id) === movieMatch.params.movieId
    );
  return (
    <>
      <Wrapper>
        <SliderTitle>Top Rated ★</SliderTitle>
        <Arrow>
          <Right
            onClick={increaseIndex}
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <IoIosArrowForward />
          </Right>
          <Left
            onClick={decreaseIndex}
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <IoIosArrowBack />
          </Left>
        </Arrow>
        <AnimatePresence
          custom={back}
          initial={false}
          onExitComplete={toggleLeaving}
        >
          <Row
            custom={back}
            variants={rowVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "tween", duration: 1 }}
            key={index}
          >
            {data?.results
              .slice(1)
              .slice(offset * index, offset * index + offset)
              .map((movie) => (
                <Box
                  layoutId={movie.id + ""}
                  onClick={() => onBoxClick(movie.id)}
                  key={movie.id}
                  bgPhoto={makeImgPath(movie.poster_path)}
                  variants={boxVariants}
                  whileHover="hover"
                  initial="initial"
                  transition={{ type: "tween" }}
                >
                  <Info variants={infoVariants}>
                    <h4>{movie.title}</h4>
                  </Info>
                </Box>
              ))}
          </Row>
        </AnimatePresence>
      </Wrapper>
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
              {clickedMovie && (
                <>
                  <BigCover
                    style={{
                      backgroundImage: `linear-gradient(transparent, rgba(0,0,0,0.8)), url(${makeImgPath(
                        clickedMovie.backdrop_path,
                        "w500"
                      )})`,
                    }}
                  />
                  <MovieInfo>
                    <BigTitle>{clickedMovie.title}</BigTitle>
                    <BigOverview>{clickedMovie.overview}</BigOverview>
                  </MovieInfo>
                </>
              )}
            </BigBox>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default TopMovieSlider;
