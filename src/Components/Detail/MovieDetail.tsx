import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { getMovieDetail, IMovieDetail } from "../../api";
import { makeImgPath } from "../../utils";

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

function MovieDetail() {
  const { movieId } = useParams();
  const { data, isLoading } = useQuery<IMovieDetail>(["detail", "movie"], () =>
    getMovieDetail(movieId)
  );

  return (
    <>
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <>
          <Cover
            style={{
              backgroundImage: data
                ? `linear-gradient(transparent, rgba(0,0,0,1)), url(${makeImgPath(
                    data.backdrop_path
                  )})`
                : undefined,
            }}
          />
          <Bold>
            <Title>{data?.original_title}</Title>
            <Rate>★ {data && data.vote_average}</Rate>
          </Bold>
          <Header>
            <BigGenres>
              {data &&
                data.genres.map((genre) => (
                  <Genres key={genre.id}>{genre.name}</Genres>
                ))}
            </BigGenres>
            <RunTime>런닝타임: {data && data.runtime}분</RunTime>
          </Header>
          <Overview>{data && data.overview}</Overview>
          <Side>
            <Adult>{data?.adult ? "청소년 관람 불가" : "전체 이용가"}</Adult>
          </Side>
        </>
      )}
    </>
  );
}

export default MovieDetail;
