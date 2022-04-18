import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getAiringTv, IGetTv } from "../../api";
import { makeImgPath } from "../../utils";

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
const SliderTitle = styled.span`
  font-size: 26px;
  font-weight: 400;
  padding-left: 10px;
  position: absolute;
  top: -40px;
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

function AiringTvSlider() {
  const { data } = useQuery<IGetTv>(["tv", "airing"], getAiringTv);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [back, setBack] = useState(false);
  const navigate = useNavigate();
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      setBack(false);
      const totalTv = data.results.length;
      const maxPage = Math.floor(totalTv / offset) - 1;
      setIndex((prev) => (prev === maxPage ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      setBack(true);
      const totalTv = data.results.length;
      const maxPage = Math.floor(totalTv / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxPage : prev - 1));
    }
  };
  const onBoxClick = (tvId: number) => {
    navigate(`tv/${tvId}`);
  };
  return (
    <>
      <Wrapper>
        <SliderTitle>Airing Today</SliderTitle>
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
              .slice(offset * index, offset * index + offset)
              .map((tv) => (
                <Box
                  layoutId={tv.id + ""}
                  onClick={() => onBoxClick(tv.id)}
                  key={tv.id}
                  bgPhoto={makeImgPath(tv.poster_path)}
                  variants={boxVariants}
                  whileHover="hover"
                  initial="initial"
                  transition={{ type: "tween" }}
                >
                  <Info variants={infoVariants}>
                    <h4>{tv.name}</h4>
                  </Info>
                </Box>
              ))}
          </Row>
        </AnimatePresence>
      </Wrapper>
    </>
  );
}

export default AiringTvSlider;
