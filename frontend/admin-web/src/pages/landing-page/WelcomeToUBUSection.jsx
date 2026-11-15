

import { Button, Collapse, Flex, Typography } from "antd"
import HeadingUnder from '../../assets/heading-under.png'
import Icon1 from '../../assets/btn1-icon.svg'
import Icon2 from '../../assets/btn2-icon.svg'
import IntroVideoBg from '../../assets/IntroVideoBg.png'



import './WelcomeToUBUSection.less'
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"



function WelcomeToUbu() {
    const { t } = useTranslation()
    const { Text } = Typography;
    const navigate = useNavigate()
    const { Panel } = Collapse;


    return (
        <Flex vertical gap={30} align="center" justify='center' className="p-div-welcome">
            <Flex vertical gap='large' className="p-div-welcome-div">
                <Flex gap={5} className="welcome-1" justify="center" align="center">
                    <Flex className="welcome-1-1" justify="center" align="center">
                        <Text className="flex-text-welcome">
                            {t('landing-page.welcome.heading')}
                        </Text>
                    </Flex>
                    <Flex vertical className="welcome-1-2">
                        <Flex className="welcome-1-2-1">

                            <Text className='flex-text-welcome'>
                                {t('landing-page.welcome.heading-2')}
                            </Text>
                        </Flex>
                        <Flex className="welcome-1-2-2">
                            <img src={HeadingUnder} alt="img-under" className="heading-under-img-welcome" />
                        </Flex>
                    </Flex>
                </Flex>
                <Flex className="welcome-11" gap='middle'>
                    <Button icon={<img src={Icon1} />} onClick={() => navigate('/registration/')} className="welcome-12-btn">UBU Bussiness</Button>
                    <Button icon={<img src={Icon2} />} onClick={() => navigate('/registration/')} className="welcome-11-btn">UBU Creator</Button>
                </Flex>
            </Flex>
            <Flex className="welcome-video" gap={50}>
                <Flex className="welcome-video-section">
                    <video className="welcome-video-player" src="" poster={IntroVideoBg} />
                </Flex>
                <Flex vertical justify="center" gap={16} align="start" className="welcome-text-section">
                    <Text className="welcome-heading"> UBU Business</Text>
                    <Text className="welcome-desc"> Discover what sets UBU apart from the competition and how we will help your business. </Text>
                    <Flex className="welcome-list">
                        <Collapse accordion className="custom-collapse">
                            <Panel header="Hyper-Personalized Influencer Matching" key="1">
                                <p>Leverage UBU's AI-powered matching algorithm to connect with influencers whose audiences perfectly align with your brand's target market, ensuring highly effective and impactful marketing campaigns</p>
                            </Panel>
                            <Panel header="Access to Authentic Micro-Influencers" key="2">
                                <p>Tap into a diverse pool of nano and micro-influencers who offer genuine connections and higher engagement rates, giving your brand a fresh and relatable voice in the market.</p>
                            </Panel>
                            <Panel header="Streamlined Campaign Management" key="3">
                                <p>Simplify your influencer marketing efforts with UBU's comprehensive tools for campaign creation, contract management, and performance tracking, saving time and resources while maximizing ROI.</p>
                            </Panel>
                            <Panel header="Enhanced Accountability and Transparency" key="4">
                                <p>Benefit from UBU's double-blind review system and responsiveness tracker, which ensure reliable and transparent collaborations, building trust and fostering long-term partnerships.</p>
                            </Panel>
                        </Collapse>

                    </Flex>
                </Flex>
            </Flex>

        </Flex>
    )
}

export default WelcomeToUbu