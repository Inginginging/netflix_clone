import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMovies, IGetMovies } from "../../api";
import { makeImgPath } from "../../utils";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

const Wrapper = styled.div`
  position: relative;
  top: -100px;
  margin-bottom: 350px;
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

function Slider() {
  const { data } = useQuery<IGetMovies>(["movies", "nowPlay"], getMovies);
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
  return (
    <>
      <Wrapper>
        <SliderTitle>Now Playing</SliderTitle>
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
    </>
  );
}

export default Slider;
