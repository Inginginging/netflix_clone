import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { getMovieDetail, getTvDetail, IMovieDetail } from "../api";
import { makeImgPath } from "../utils";

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

function Detail() {
  const { movieId, tvId } = useParams();
  const { data, isLoading } = useQuery<IMovieDetail>(
    ["detail"],
    () => (movieId ? getMovieDetail(movieId) : getTvDetail(tvId as any)),
    { keepPreviousData: true }
  );

  return (
    <>
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <>
          <BigCover
            style={{
              backgroundImage: `linear-gradient(transparent, rgba(0,0,0,0.8)), url(${makeImgPath(
                data?.backdrop_path + "",
                "w500"
              )})`,
            }}
          />
          <MovieInfo>
            <BigTitle>{data?.original_title}</BigTitle>
            <BigOverview>{data?.overview}</BigOverview>
          </MovieInfo>
        </>
      )}
    </>
  );
}

export default Detail;
