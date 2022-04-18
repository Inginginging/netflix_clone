import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { ITvSearchResult, IMovieSearchResult, multiSearch } from "../api";
import { makeImgPath } from "../utils";

const Wrapper = styled.div`
  padding: 80px 10px;
`;
const Title = styled.h1`
  font-size: 26px;
  font-weight: 500;
  margin-bottom: 20px;
`;
const BoxContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px;
`;
const Box = styled(motion.div)<{ bgPhoto: string }>`
  height: 250px;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  cursor: pointer;
  position: relative;
`;
const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  width: 100%;
  position: absolute;
  bottom: 0px;
  opacity: 0;
  z-index: 100;
  h4 {
    color: white;
    font-size: 16px;
    text-align: center;
  }
`;

const boxVariants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.1,
    zIndex: 99,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};
const infoVariants = {
  initial: { opacity: 0 },
  hover: {
    opacity: 1,
    zIndex: 100,
    transition: {
      delay: 0.3,
      duration: 0.3,
      type: "tween",
    },
  },
};

function Search() {
  //현재 url 주소를 따옴
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword"); //keword에 해당하는 param 가져옴
  const { data: movieData, isLoading: movieLoading } =
    useQuery<IMovieSearchResult>(["movieResult"], () => multiSearch(keyword));
  const { data: tvData, isLoading: tvLoading } = useQuery<ITvSearchResult>(
    ["tvResult"],
    () => multiSearch(keyword)
  );
  return (
    <>
      {movieLoading || tvLoading ? (
        <span>Loading...</span>
      ) : (
        <Wrapper>
          <Title>영화 및 TV 프로그램</Title>
          <BoxContainer>
            <AnimatePresence>
              {movieData?.results.map((result) => (
                <Box
                  variants={boxVariants}
                  initial="initial"
                  whileHover="hover"
                  key={result.id}
                  bgPhoto={
                    result.backdrop_path
                      ? makeImgPath(result.backdrop_path, "w500")
                      : makeImgPath(result.poster_path, "w500")
                  }
                >
                  <Info variants={infoVariants} whileHover="hover">
                    <h4>{result.title}</h4>
                  </Info>
                </Box>
              ))}
              {tvData?.results.map((result) => (
                <Box
                  variants={boxVariants}
                  initial="initial"
                  whileHover="hover"
                  key={result.id}
                  bgPhoto={
                    result.backdrop_path
                      ? makeImgPath(result.backdrop_path, "w500")
                      : makeImgPath(result.poster_path, "w500")
                  }
                >
                  <Info>
                    <h4>{result.name}</h4>
                  </Info>
                </Box>
              ))}
            </AnimatePresence>
          </BoxContainer>
        </Wrapper>
      )}
    </>
  );
}

export default Search;
