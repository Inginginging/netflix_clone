import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMovies } from "../../api";
import { makeImgPath } from "../../utils";

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.8)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;
const Title = styled.h2`
  font-size: 78px;
  font-weight: 500;
  margin-bottom: 20px;
`;
const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

function MovieBanner() {
  const { data } = useQuery<IGetMovies>(["movies", "nowPlaying"], getMovies);
  return (
    <Banner bgPhoto={makeImgPath(data?.results[0].backdrop_path || "")}>
      <Title>{data?.results[0].title}</Title>
      <Overview>{data?.results[0].overview}</Overview>
    </Banner>
  );
}

export default MovieBanner;
