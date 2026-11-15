import GoogleLogo from "../../assets/google-play-logo.png"
import AppleLogo from "../../assets/apple-logo.png"
import Ellips1 from "../../assets/ellipse-1.png"
import Ellipse2 from "../../assets/ellipse-2.png"
import Mobile from "../../assets/mobile.png"
import StoreButton from '../../components/SocialButtons';
import './DownloadOurAppSection.less'
import { Flex, Typography } from "antd"
import {useState } from "react"
import { useTranslation } from "react-i18next"
import EmailCaptureModal from "../../components/Modals/EmailCaptureModal"
import './Modal.less'

function MiddleLandingPageComponent() {
  let modal = null;
  const { Text, Link } = Typography;
  const { t } = useTranslation();
  const [isModalVisible,setIsModalVisible] = useState(false)

  return (

      <Flex gap='middle' align="stretch" className="parent-div-middle">
        <EmailCaptureModal key={isModalVisible} isOpen={isModalVisible} setIsOpen={setIsModalVisible}/>
        <Flex vertical className="parents" align="center" justify="center" gap='large' >
          <Flex className="parent-store-btns">
            <Text className="download-our-app">Download Our App</Text>
          </Flex>
          <Flex className="parent-store-btns2" >
            <Text className="discover-text">Explore curated looks, shop your favorite brands, and find your new go-to style icons. Start exploring and unlock a world of possibilities.</Text>
          </Flex>
          <Flex gap='large' className="parent-store-btns">
            <Flex>
              <StoreButton smallText='Download on the' largeText='App Store' imgSrc={AppleLogo} handleClick={()=>setIsModalVisible(true)}></StoreButton>
            </Flex>
          </Flex>
        </Flex>
        <Flex className="container" justify="center">
          <Flex gap='large' className="ellipse-container" >
            <Flex vertical justify='end' className="ellipse-c-2">

              <img src={Ellipse2} className="ellipse-img-2" />
            </Flex>
            <Flex vertical justify="start" className="ellipse-c-1">
              <img src={Ellips1} className="ellipse-img-1" />
            </Flex>

          </Flex>
          <Flex className="mob-container">
            <img src={Mobile} />
          </Flex>

        </Flex>

      </Flex>

  )
}

export default MiddleLandingPageComponent