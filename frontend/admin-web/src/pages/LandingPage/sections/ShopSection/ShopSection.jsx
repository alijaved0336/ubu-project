import { Flex, Grid, Typography } from "antd";
import InflucerProfileCard from "@src/components/InflucenerProfileCard";
import Inf1 from "@src/assets/inf1.png";
import Inf2 from "@src/assets/inf2.png";
import Inf3 from "@src/assets/inf3.png";
import Inf4 from "@src/assets/inf4.png";
import Inf5 from "@src/assets/inf5.png";

import "./ShopSection.less";

import ReactSlick from "@src/components/Common/Carousels/ReactSlick/ReactSlick";

const influencers = [
  { image: Inf1, blurhash: "L.L}BIRP~qxut7ayWBogxuayRjof" },
  { image: Inf2, blurhash: "L4FM9K:,02yC3.}s:81I-UGE1IIC" },
  { image: Inf3, blurhash: "LPNJRYDh~Wxu-ot7tSt7%MWBIUof" },
  { image: Inf4, blurhash: "LiNA9m_3_NDi~pkCW;MxELRPaeof" },
  { image: Inf5, blurhash: "LUIzCi%2~8WB=_WBayRkNHWBayt7" },
];

function ShopSection() {
  const { Text } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  return (
    <>
      <Flex
        gap="small"
        vertical
        align="center"
        justify="center"
        className="p-div-six"
      >
        <Flex align="center" justify="center">
          <Text className="flex-text-six">Shop with UBU Creator</Text>
        </Flex>
        <Flex className="p-div-six-div" align="center" justify="center">
          <Text className="flex-desc ff-manrope">
            Discover fashion, beauty, home, and fitness products, all tried and
            styled by real people for everyday living.
          </Text>
        </Flex>

        <ReactSlick className="tw-mt-10">
          {influencers.map((inf, index) => {
            return (
              <InflucerProfileCard
                imgSrc={inf.image}
                blurHash={inf.blurhash}
                key={index + 1}
              />
            );
          })}
        </ReactSlick>
        <Flex
          className={`${!screens.lg ? "flex-middle" : "flex-middle2"} tw-pt-10`}
        >
          {/* {!screens.md ? (
            <Flex gap="large" vertical className="flex-middle">
              <CustomCarousal>
                {influencers.map((inf) => {
                  return <InflucerProfileCard imgSrc={inf} />;
                })}
              </CustomCarousal>
            </Flex>
          ) : (
            <Flex gap={"1rem"}>
              {influencers.map((inf) => {
                return (
                  <Flex className="p-div-img-container">
                    <InflucerProfileCard imgSrc={inf} />
                  </Flex>
                );
              })}
            </Flex>
          )} */}
        </Flex>
      </Flex>
    </>
  );
}

export default ShopSection;
