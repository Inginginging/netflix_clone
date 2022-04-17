import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { getMovieDetail, getTvDetail, IMovieDetail } from "../api";
import { makeImgPath } from "../utils";

const Cover = styled.div`
  width: 100%;
  height: 450px;
  background-position: center top;
  background-size: cover;
`;
const Bold = styled.div`
  display: flex;
  padding: 0px 30px;
  justify-content: space-between;
  align-items: center;
  position: relative;
  top: -55px;
`;
const Title = styled.h1`
  font-size: 40px;
  font-weight: 400;
`;
const Rate = styled.span`
  color: red;
  padding-top: 15px;
`;
const Header = styled.header`
  position: relative;
  top: -40px;
  font-size: 20px;
  padding: 0px 20px;
  display: flex;
  justify-content: space-between;
`;
const BigGenres = styled.div``;
const Genres = styled.span`
  margin-right: 10px;
`;
const RunTime = styled.span``;
const Overview = styled.p`
  padding: 0px 20px;
  position: relative;
  top: -20px;
  font-size: 18px;
`;
const Side = styled.div`
  display: flex;
  padding: 0px 20px;
  font-size: 18px;
`;
const Adult = styled.span`
  color: red;
  font-weight: 400;
`;

function Detail() {
  const { movieId, tvId } = useParams();
  const { data: movieData, isLoading: movieLoading } = useQuery<IMovieDetail>(
    ["detail"],
    () => (movieId ? getMovieDetail(movieId) : getTvDetail(tvId as any))
  );

  return (
    <>
      {movieLoading ? (
        <span>Loading...</span>
      ) : (
        <>
          <Cover
            style={{
              backgroundImage: movieData
                ? `linear-gradient(transparent, rgba(0,0,0,1)), url(${makeImgPath(
                    movieData.backdrop_path
                  )})`
                : undefined,
            }}
          />
          <Bold>
            <Title>{movieData?.original_title}</Title>
            <Rate>★ {movieData && movieData.vote_average}</Rate>
          </Bold>
          <Header>
            <BigGenres>
              {movieData &&
                movieData.genres.map((genre) => (
                  <Genres key={genre.id}>{genre.name}</Genres>
                ))}
            </BigGenres>
            <RunTime>런닝타임: {movieData && movieData.runtime}분</RunTime>
          </Header>
          <Overview>{movieData && movieData.overview}</Overview>
          <Side>
            <Adult>
              {movieData?.adult ? "청소년 관람 불가" : "전체 이용가"}
            </Adult>
          </Side>
        </>
      )}
    </>
  );
}

export default Detail;
