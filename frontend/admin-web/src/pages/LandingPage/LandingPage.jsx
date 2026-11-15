import { useRef } from "react";
import { Flex } from "antd";

import LandingPageLayout from "../layouts/LandingPageLayout.jsx";
import FooterLayout from "../layouts/FooterLayout.jsx";

import ImageSection from "../about-us/AboutUs/imageSection";
import StorySection from "../about-us/AboutUs/storySection";
import SliderContent from "../about-us/AboutUs/slider";
import BlogSection from "../about-us/AboutUs/blogSection";
import WelcomeSection from "../about-us/AboutUs/welcomeSection";

const LandingPage = () => {
  const scrollToUbuCreators = useRef(null);
  const handleScrollToCreators = () => {
    scrollToUbuCreators.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <LandingPageLayout>
      <div className="LandingPage">
        <FooterLayout>
          {/* Image Section */}
          <ImageSection />

          {/* Welcome UBU Section */}
          <WelcomeSection />

          {/* Story Section */}
          <StorySection />

          {/* Slider Section */}
          <SliderContent />

          {/* Blog Section */}
          <BlogSection />
        </FooterLayout>
      </div>
    </LandingPageLayout>
  );
};

export default LandingPage;
