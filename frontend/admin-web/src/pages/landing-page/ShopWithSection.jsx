
import { Carousel, Flex, Grid, Typography } from "antd"
import InflucerProfileCard from "../../components/InflucenerProfileCard"
import Inf1 from "../../assets/influncer1.png"
import Inf2 from "../../assets/inf2.png"
import Inf3 from "../../assets/inf3.png"
import Inf4 from "../../assets/inf4.png"
import Inf5 from "../../assets/inf5.png"


import './ShopWithSection.less'



function SixLandingPageComponent() {
  const { Text, Link } = Typography;
  const { useBreakpoint } = Grid
  const screens = useBreakpoint()
  return (
    <>
      <Flex gap='small' vertical align="center" justify='center' className="p-div-six">
        <Flex align="center" justify="center" >

          <Text className="flex-text-six">
            Shop with UBU Creator
          </Text>
        </Flex>
        <Flex className="p-div-six-div" align="center" justify="center">
          <Text className="flex-desc">
          <strong>Discover a new world of style inspiration with UBU.</strong> Connect with a diverse network of creators who share your body type and fashion sense.
          </Text>
        </Flex>
        <Flex className={`${!screens.lg ? "flex-middle" : "flex-middle2"}`} >
          {!screens.lg?
            <>
              <Carousel arrows infinite={true}>
                <InflucerProfileCard className="p-div-img-container" imgSrc={Inf1} />
                <InflucerProfileCard className="p-div-img-container" imgSrc={Inf2} />
                <InflucerProfileCard className="p-div-img-container" imgSrc={Inf3} />
                <InflucerProfileCard className="p-div-img-container" imgSrc={Inf4} />
                <InflucerProfileCard className="p-div-img-container" imgSrc={Inf5} />
              </Carousel>
            </>
            :
            <>
              <Flex className="p-div-img-container">
                <InflucerProfileCard imgSrc={Inf1} />
              </Flex>
              <Flex className="p-div-img-container">

                <InflucerProfileCard imgSrc={Inf2} />
              </Flex>
              <Flex className="p-div-img-container">

                <InflucerProfileCard imgSrc={Inf3} />
              </Flex>
              <Flex className="p-div-img-container">

                <InflucerProfileCard imgSrc={Inf4} />
              </Flex>
              <Flex className="p-div-img-container">

                <InflucerProfileCard imgSrc={Inf5} />
              </Flex>
            </>
          }
        </Flex>

      </Flex>
    </>
  )
}

export default SixLandingPageComponent