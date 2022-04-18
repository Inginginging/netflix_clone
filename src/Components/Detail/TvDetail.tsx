import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { getTvDetail, ITvDetail } from "../../api";
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
const Season = styled.span``;
const Overview = styled.p`
  padding: 0px 20px;
  position: relative;
  top: -20px;
  font-size: 18px;
`;

function TvDetail() {
  const { tvId } = useParams();
  const { data, isLoading } = useQuery<ITvDetail>(["detail", "tv"], () =>
    getTvDetail(tvId)
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
            <Title>{data?.name}</Title>
            <Rate>{data?.popularlity}</Rate>
          </Bold>
          <Header>
            <BigGenres>
              {data &&
                data.genres.map((genre) => (
                  <Genres key={genre.id}>{genre.name}</Genres>
                ))}
            </BigGenres>
            <Season>
              {data?.number_of_seasons}시즌 총{data?.number_of_episodes}회
            </Season>
          </Header>
          <Overview>{data?.overview}</Overview>
        </>
      )}
    </>
  );
}

export default TvDetail;
