import { Row, Col, Flex, Typography } from "antd";
import "./HeroSection.less";

import LandingMan from "@src/assets/landing-man.png";
import LandingMan2 from "@src/assets/man2.png";
import LandingMan3 from "@src/assets/man3.png";
import LandingMan4 from "@src/assets/man4.png";
import sideVector from "@src/assets/side-vector.png";
import { ImageCard } from "../index";
import Img from "@src/assets/img-btn-2.png";
import circle from "@src/assets/code-circle.png";
import global from "@src/assets/global.png";
import HeadingUnder from "@src/assets/heading-under.png";

function HeroSection() {
  const { Text } = Typography;
  return (
    <div className="HeroSection">
      <Row
        className="wrapper"
        align={"middle"}
        gutter={{ xs: 16, sm: 16, md: 16, lg: 0 }}
      >
        <Col
          className="col col-1"
          xs={{ span: 24, order: 2 }}
          sm={{ span: 24, order: 2 }}
          md={{ span: 24, order: 2 }}
          lg={{ span: 12, order: 1 }}
        >
          <Flex className="bg-container">
            <Row justify={"space-between"} style={{ width: "100%" }}>
              <Col>
                <Flex vertical gap={"6rem"}>
                  <ImageCard
                    className="image2 tw-aspect-square tw-rounded-xl"
                    imgSrc={LandingMan2}
                    btnText="Shoppers"
                    align="end"
                    btnAlign="btn-right"
                    iconImg={Img}
                    hash="LNFZNauPVYGFyE%hNZv~00D$ozww"
                  />
                  <ImageCard
                    className="image4 tw-aspect-square tw-rounded-xl"
                    imgSrc={LandingMan4}
                    btnText="AI Technology"
                    align="end"
                    btnAlign="btn-right"
                    iconImg={Img}
                    hash="L91hQ.T1l:QkQ,s:TetRmPRPu6XT"
                  />
                </Flex>
              </Col>
              <Col>
                <Flex
                  vertical
                  gap={"2.5rem"}
                  style={{ marginTop: "-4rem" }}
                  align="center"
                >
                  <ImageCard
                    className="image1 tw-aspect-square tw-rounded-xl"
                    imgSrc={LandingMan}
                    btnText="Brand"
                    align="start"
                    btnAlign="btn-left"
                    iconImg={global}
                    hash="LfLDiNfkbwIU~qRjayWAR.jtRioe"
                  />
                  <ImageCard
                    className="image3 tw-aspect-square tw-rounded-xl"
                    imgSrc={LandingMan3}
                    btnText="Creators"
                    align="start"
                    btnAlign="btn-left"
                    iconImg={circle}
                    hash="LCPO*N-T_}q@5vrq%%9H9%RQETNL"
                  />
                </Flex>
              </Col>
            </Row>
          </Flex>
        </Col>
        <Col
          className="col col-2"
          xs={{ span: 24, order: 1 }}
          sm={{ span: 24, order: 1 }}
          md={{ span: 24, order: 1 }}
          lg={{ span: 12, order: 2 }}
          style={{ display: "flex", position: "unset" }}
        >
          <Flex style={{ flexGrow: 1 }} className="heading-wrapper" vertical>
            <Flex>
              <h1 className="main-heading">
                Connecting <br /> Shoppers,{" "}
              </h1>
            </Flex>
            <Flex className="heading-wrapper-creator" vertical>
              <h1 className="main-heading heading-creators">Creators,</h1>
              <img
                src={HeadingUnder}
                height="inherit"
                width="inherit"
                className="heading-under-img"
              />
            </Flex>
            <Flex>
              <h1 className="main-heading heading-font2">
                & Brand with AI technology
              </h1>
            </Flex>
            <Flex>
              <Text type="secondary" className="text-muted ff-manrope">
                Discover a new world of style inspiration with UBU. Connect with
                a diverse network of creators who share your body type and
                fashion sense
              </Text>
            </Flex>
          </Flex>

          <div
            // className="tw-absolute tw-top-0 tw-right-0"
            className="side-vector-wrapper"
          >
            <img className="side-vector" src={sideVector} />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default HeroSection;
