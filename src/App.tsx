import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #e09, #d0e);
  flex-direction: column;
`;
const Box = styled(motion.div)`
  width: 400px;
  height: 200px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 40px;
  position: absolute;
  top: 100px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
`;

const boxVariants = {
  initial: (back: boolean) => ({ x: back ? -500 : 500, opacity: 0, scale: 0 }),
  visible: { opacity: 1, scale: 1, x: 0, transition: { duration: 1 } },
  exit: (back: boolean) => ({
    x: back ? 500 : -500,
    opacity: 0,
    scale: 0,
    transition: { duration: 1 },
  }),
};
function App() {
  const [visible, setVisible] = useState(1);
  const [back, setBack] = useState(false);
  const handleNext = () => {
    setBack(false);
    setVisible((prev) => (prev === 10 ? 10 : prev + 1));
  };
  const handlePrev = () => {
    setBack(true);
    setVisible((prev) => (prev === 1 ? 1 : prev - 1));
  };
  return (
    <Wrapper>
      <AnimatePresence exitBeforeEnter custom={back}>
        <Box
          /*custom: 각 애니메이션 component에 대해 variants를 다르게 적용할때 사용. => variants를 함수로 return */
          custom={back}
          key={visible}
          variants={boxVariants}
          initial="initial"
          animate="visible"
          exit="exit"
        >
          {visible}
        </Box>
      </AnimatePresence>
      <button onClick={handleNext}>next</button>
      <button onClick={handlePrev}>prev</button>
    </Wrapper>
  );
}

export default App;
