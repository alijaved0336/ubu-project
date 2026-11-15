import { useState } from "react";
import { Divider, Flex, Grid, Typography } from "antd";
import { useNavigate } from "react-router-dom";

import "./MyFooter.less";

import StoreButton from "@src/components/SocialButtons";
import AppleLogo from "@src/assets/images/appIcon.png";
import Twitter from "@src/assets/twitter.svg";
import Fb from "@src/assets/fb.svg";
import Insta from "@src/assets/insta.svg";
import EmailCaptureModal from "@src/components/Modals/EmailCaptureModal";
import {
  InstagramOutlined,
  LinkedinFilled,
  TikTokOutlined,
} from "@ant-design/icons";

const MyFooter = () => {
  const { Text, Link } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const navigate = useNavigate();
  const navigateToBrandRegistration = () => {
    navigate("/registration");
  };
  const navigateToCreatorRegistration = () => {
    navigate("/registration");
  };

  return (
    <Flex vertical justify="center" className="parent-footer">
      <EmailCaptureModal
        key={isModalVisible}
        isOpen={isModalVisible}
        setIsOpen={setIsModalVisible}
      />

      <Flex
        align="center"
        gap="middle"
        justify="space-between"
        className="footer-flex-1"
      >
        <Flex>
          <Text className="footer-flex-text">
            What&apos;s Trending for Winter in the app
          </Text>
        </Flex>
        <Flex gap="large" className="footer-flex-social-btns">
          <StoreButton
            className="footer-social-btns"
            handleClick={() => setIsModalVisible(true)}
            smallText=""
            largeText="Download Now"
            imgSrc={AppleLogo}
          />
        </Flex>
      </Flex>
      <Flex className="footer-flex-2">
        <Divider className="footer-flex-2-divider" />
      </Flex>
      {screens.xs ? (
        <Flex
          gap="middle"
          vertical
          justify="center"
          className="footer-flex-3-parent"
        >
          <Flex
            gap="middle"
            vertical
            className="footer-flex-3"
            justify="center"
            align="center"
          >
            <Flex className="footer-flex-3-1">
              <Text className="footer-flex-3-1-text ff-manrope">UBU</Text>
            </Flex>
            <Flex className="footer-flex-3-2" justify="center" align="center">
              <Text className="footer-flex-3-2-text ff-manrope">
                Get in touch with us! Whether you need support, have feedback,
                or just want to say hello, our team is ready to assist you.
              </Text>
            </Flex>
            <Flex gap={30}>
              <a
                href="https://www.linkedin.com/company/ubu-platforms-inc/"
                target="_blank"
                className="tw-no-underline hover:tw-no-underline hover:tw-text-current tw-text-[1.125rem]"
              >
                <LinkedinFilled />
              </a>
              <a href="https://x.com/" target="_blank">
                <img src={Twitter} alt="twitter-logo" />
              </a>
              <a href="https://www.facebook.com/" target="_blank">
                <img src={Fb} alt="fb-logo" />
              </a>
              <a href="https://www.instagram.com/" target="_blank">
                <img src={Insta} alt="insta-logo" />
              </a>
            </Flex>
          </Flex>
          <Flex className="footer-links" align="normal" gap="large">
            <Flex vertical className="footer-flex-4">
              <Flex className="footer-flex-4-1">
                <Text className="footer-flex-4-1-text ff-manrope">
                  Follow Us
                </Text>
              </Flex>
              <Flex className="footer-flex-4-2">
                <Text className="footer-flex-4-2-text ff-manrope">
                  @shop.ubu
                </Text>
              </Flex>
              <Flex className="footer-flex-4-2">
                <Text className="footer-flex-4-2-text ff-manrope">
                  @ubu.home
                </Text>
              </Flex>
              <Flex className="footer-flex-4-2">
                <Text className="footer-flex-4-2-text ff-manrope">
                  @ubu.family
                </Text>
              </Flex>
            </Flex>

            <Flex vertical className="footer-flex-4">
              <Flex className="footer-flex-4-1">
                <Text className="footer-flex-4-1-text ff-manrope">
                  Learn More
                </Text>
              </Flex>
              <Flex className="footer-flex-4-2">
                <Link
                  className="footer-flex-4-2-text link-text ff-manrope"
                  href="/about-us"
                  target="_blank"
                >
                  About Us
                </Link>
              </Flex>
              <Flex className="footer-flex-4-2">
                <Link
                  href="/registration"
                  target="_blank"
                  className="footer-flex-4-2-text link-text ff-manrope"
                >
                  Register Your Brand
                </Link>
              </Flex>
              <Flex className="footer-flex-4-2">
                <Link
                  href="/registration"
                  target="_blank"
                  className="footer-flex-4-2-text link-text ff-manrope"
                >
                  Register as a Creator
                </Link>
              </Flex>
            </Flex>
            <Flex vertical className="footer-flex-4">
              <Flex className="footer-flex-4-1">
                <Text className="footer-flex-4-1-text ff-manrope">Support</Text>
              </Flex>
              <Flex className="footer-flex-4-2">
                <Link
                  className="footer-flex-4-2-text link-text ff-manrope"
                  href="/contact-us"
                  target="_blank"
                >
                  Contact Us
                </Link>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      ) : (
        <Flex
          gap="middle"
          justify="space-between"
          className="footer-flex-3-parent"
        >
          <Flex gap="middle" vertical className="footer-flex-3">
            <Flex className="footer-flex-3-1">
              <Text className="footer-flex-3-1-text ff-manrope">UBU</Text>
            </Flex>
            <Flex className="footer-flex-3-2">
              <Text className="footer-flex-3-2-text ff-manrope">
                Get in touch with us! Whether you need support, have feedback,
                or just want to say hello, our team is ready to assist you.
              </Text>
            </Flex>
            <Flex gap={30}>
              {/* <a href="https://x.com/" target="_blank">
                <img src={Twitter} alt="twitter-logo" />
              </a> */}
              <a
                href="https://www.linkedin.com/company/ubu-platforms-inc/"
                target="_blank"
                className="tw-no-underline hover:tw-no-underline hover:tw-text-current tw-text-[1.125rem]"
              >
                <LinkedinFilled />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61564362906545&mibextid=wwXIfr"
                target="_blank"
              >
                <img src={Fb} alt="fb-logo" />
              </a>
              <a
                href="https://www.instagram.com/ubu_platforms/profilecard/?igsh=MWI3bTVtamw1bHdjMQ=="
                target="_blank"
                className="tw-no-underline hover:tw-no-underline hover:tw-text-current tw-text-[1.125rem]"
              >
                <InstagramOutlined />
              </a>
              <a
                href="https://www.tiktok.com/@shop.ubu?_t=ZP-8suF4hqbgoZ&_r=1"
                target="_blank"
                className="tw-no-underline hover:tw-no-underline hover:tw-text-current tw-text-[1.125rem]"
              >
                <TikTokOutlined />
              </a>
            </Flex>
          </Flex>
          <Flex vertical className="footer-flex-4">
            <Flex className="footer-flex-4-1">
              <Text className="footer-flex-4-1-text ff-manrope">Follow Us</Text>
            </Flex>
            <Flex className="footer-flex-4-2">
              <a
                href="https://www.tiktok.com/@shop.ubu?_t=ZP-8suF4hqbgoZ&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                className="tw-no-underline hover:tw-no-underline"
              >
                <Text className="footer-flex-4-2-text ff-manrope">
                  @shop.ubu
                </Text>
              </a>
            </Flex>
            <Flex className="footer-flex-4-2">
              <a
                href="https://www.tiktok.com/@shop.ubu?_t=ZP-8suF4hqbgoZ&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                className="tw-no-underline hover:tw-no-underline"
              >
                <Text className="footer-flex-4-2-text ff-manrope">
                  @ubu.home
                </Text>
              </a>
            </Flex>
            <Flex className="footer-flex-4-2">
              <a
                href="https://www.tiktok.com/@shop.ubu?_t=ZP-8suF4hqbgoZ&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                className="tw-no-underline hover:tw-no-underline"
              >
                <Text className="footer-flex-4-2-text ff-manrope">
                  @ubu.family
                </Text>
              </a>
            </Flex>
          </Flex>
          <Flex vertical className="footer-flex-4">
            <Flex className="footer-flex-4-1">
              <Text className="footer-flex-4-1-text ff-manrope">
                Learn More
              </Text>
            </Flex>
            <Flex className="footer-flex-4-2">
              <Link
                className="footer-flex-4-2-text link-text ff-manrope"
                href="/about-us"
                target="_blank"
              >
                About Us
              </Link>
            </Flex>
            <Flex className="footer-flex-4-2">
              <Link
                href="/registration"
                target="_blank"
                className="footer-flex-4-2-text link-text ff-manrope"
              >
                Register Your Brand
              </Link>
            </Flex>
            <Flex className="footer-flex-4-2">
              <Link
                href="/registration"
                target="_blank"
                className="footer-flex-4-2-text link-text ff-manrope"
              >
                Register as a Creator
              </Link>
            </Flex>
          </Flex>
          <Flex vertical className="footer-flex-4">
            <Flex className="footer-flex-4-1">
              <Text className="footer-flex-4-1-text ff-manrope">Support</Text>
            </Flex>
            <Flex className="footer-flex-4-2">
              <Link
                className="footer-flex-4-2-text link-text ff-manrope"
                href="/contact-us"
                target="_blank"
              >
                Contact Us
              </Link>
            </Flex>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};

export default MyFooter;
