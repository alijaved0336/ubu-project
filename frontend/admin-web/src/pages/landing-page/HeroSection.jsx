import { Flex, Input, Typography } from "antd"
import './HeroSection.less'
import HeadingUnder from '../../assets/heading-under.png'
import LandingMan from '../../assets/landing-man.png'
import LandingMan2 from '../../assets/man2.png'
import LandingMan3 from '../../assets/man3.png'
import LandingMan4 from '../../assets/man4.png'
import SearchIcon from "../../assets/search-icon.png"
import ImageCard from "../../components/ImageCard"
import RightImageCard from "../../components/ImageCard/RightSide"


function LandingComponent() {
  const { Text, Link } = Typography;

  return (
    <Flex gap="middle" justify="space-between" className="parent-div">
      <Flex className="flex-1">
        <div className="bg-landing">
        </div>
        <Flex className="bg-landing-wrapper">
          <Flex vertical className="bg-landing-1">
            <ImageCard className='image-2' imgSrc={LandingMan2} btnText='Shoppers' align='end' />
            <ImageCard className='image-4' imgSrc={LandingMan4} btnText='AI Technology' align='end' />
          </Flex>
          <Flex vertical align="end" className="bg-landing-2">
            <RightImageCard className='image-1' imgSrc={LandingMan} btnText='Brands' align='start' />
            <RightImageCard className='image-3' imgSrc={LandingMan3} btnText='Creators' align='start' />
          </Flex>
        </Flex>
      </Flex>
      <Flex gap={8} className="flex-2">
        <Flex vertical className="heading-div">
          <Flex>
            <h1 className="heading-font">
              Connecting Shoppers, <span className="heading-creators">Creators,</span>
            </h1>
          </Flex>
          <Flex>
            <img src={HeadingUnder} height='inherit' width='inherit' className="heading-under-img" />
          </Flex>
          <Flex>
            <h1 className="heading-font2">
              & Brands with AI Technology.
            </h1>
          </Flex>
          <Flex>
            <Text type="secondary" className="subtext"><strong>Discover a new world of style inspiration with UBU.</strong> Connect with a diverse network of creators who share your body type and fashion sense.</Text>
          </Flex>
          {/* <Flex>
            <Input size="large" placeholder="Search Products" className="search-input" prefix={<img src={SearchIcon} />} />
          </Flex> */}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default LandingComponent
