import styled from "styled-components";
import { motion, useMotionValue, useTransform } from "framer-motion";

const Wrapper = styled(motion.div)`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Box = styled(motion.div)`
  width: 200px;
  height: 200px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 40px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
`;

function App() {
  //x의 값을 추적하는 useMotionValue hook => x 값이 변할때마다 모두 rerendering 하지 않음.
  const x = useMotionValue(0);
  //useTransform(추적할 값, 값의 input, input에 따른 output)
  const rotateZ = useTransform(x, [-800, 800], [-360, 360]);
  const gradient = useTransform(
    x,
    [-800, 800],
    [
      "linear-gradient(135deg, rgb(0, 210, 238), rgb(0, 83, 238))",
      "linear-gradient(135deg, rgb(0, 238, 155), rgb(238, 178, 0))",
    ]
  );
  return (
    <Wrapper style={{ background: gradient }}>
      <Box style={{ x: x, rotateZ: rotateZ }} drag="x" dragSnapToOrigin />
    </Wrapper>
  );
}

export default App;
