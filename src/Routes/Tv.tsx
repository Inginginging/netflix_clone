import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getLatestTv, IGetLatestTv } from "../api";
import TvBanner from "../Components/Banner/TvBanner";
import TvDetail from "../Components/Detail/TvDetail";
import AiringTvSlider from "../Components/tvSlider/AiringTvSlider";
import PopularTvSlider from "../Components/tvSlider/PopularTvSlider";
import TopTvSlider from "../Components/tvSlider/TopTvSlider";

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

function Tv() {
  const { isLoading } = useQuery<IGetLatestTv>(["tv", "latest"], getLatestTv);
  const navigate = useNavigate();
  const tvMatch = useMatch("/tv/:tvId");
  const { scrollY } = useViewportScroll();
  const onOverlayClick = () => {
    navigate("/tv");
  };
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <TvBanner />
          <Sliders>
            <PopularTvSlider />
            <TopTvSlider />
            <AiringTvSlider />
          </Sliders>
          {
            <AnimatePresence>
              {tvMatch ? (
                <>
                  <Overlay
                    onClick={onOverlayClick}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                  <BigBox
                    style={{ top: scrollY.get() + 50 }}
                    layoutId={tvMatch.params.tvId}
                  >
                    <TvDetail />
                  </BigBox>
                </>
              ) : null}
            </AnimatePresence>
          }
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
