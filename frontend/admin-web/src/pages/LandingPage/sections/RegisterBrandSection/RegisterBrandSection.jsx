import { useNavigate } from "react-router-dom";
import { Button, Flex, Typography } from "antd";

import "./RegisterBrandSection.less";

import S1 from "@src/assets/s-1.svg";
import S2 from "@src/assets/s-2.svg";
import S3 from "@src/assets/s-3.svg";
import S4 from "@src/assets/s-4.svg";
import S5 from "@src/assets/s-5.svg";
import S6 from "@src/assets/s-6.svg";

function RegisterBrandSection() {
  const { Text } = Typography;
  const navigate = useNavigate();
  return (
    <Flex
      vertical
      gap={30}
      align="start"
      justify="center"
      className="p-div-seven"
    >
      <Flex className="s-f1" align="center" justify="space-between">
        <Flex className="s-f1-f1">
          <Text className="s-f1-f1-text">Registered Creators</Text>
        </Flex>
        <Flex className="s-f1-f2">
          <Button
            className="s-f1-f2-btn"
            onClick={() => navigate("/registration")}
          >
            Register as a Creator{" "}
          </Button>
        </Flex>
      </Flex>
      <Flex className="s-f2">
        <Text className="s-f2-text ff-manrope">
          Effortlessly Register Your Products at UBU with Fast, Secure, and
          Reliable Service for Maximum Peace of Mind.
        </Text>
      </Flex>
      <Flex className="s-f3" gap="large" justify="space-between">
        <img src={S1} alt="img1" className="s-f3-img" />
        <img src={S2} alt="img2" className="s-f3-img" />
        <img src={S3} alt="img3" className="s-f3-img" />
        <img src={S4} alt="img4" className="s-f3-img" />
        <img src={S5} alt="img5" className="s-f3-img" />
        <img src={S6} alt="img6" className="s-f3-img" />
      </Flex>
    </Flex>
  );
}

export default RegisterBrandSection;
