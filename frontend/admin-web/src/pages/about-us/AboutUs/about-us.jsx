import FooterLayout from "@src/pages/layouts/FooterLayout";
import LandingPageLayout from "@src/pages/layouts/LandingPageLayout";
import { Flex } from "antd";
// import { Container } from "@src/components";

import {
  DownloadOurAppSection,
  HeroSection,
  RegisterBrandSection,
  RegisterCreatorSection,
  ShopSection,
  TrendingSection,
  WhatHappensSection,
  WelcomeSection,
} from "@src/pages/LandingPage/sections";

import "./about-us-new.less";
import { useRef } from "react";
import Container from "@src/components/Common/Container/Container";

const NewAboutUs = () => {
  const scrollToUbuCreators = useRef(null);
  const handleScrollToCreators = () => {
    scrollToUbuCreators.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      <LandingPageLayout handleScrollToCreators={handleScrollToCreators}>
        <div className="AboutUs">
          <FooterLayout>
            <Container className="tw-relative">
              <div className="tw-flex tw-flex-col tw-items-center tw-mx-auto tw-max-w-full sm:tw-px-4 md:tw-max-w-[58.75rem] lg:tw-max-w-[67.5rem] xl:tw-max-w-[85rem] xl:tw-px-0 lg:tw-px-0 xs:tw-px-4 tw-pt-12">
                <HeroSection />
                <WelcomeSection />
                <DownloadOurAppSection />
              </div>
            </Container>
            <Container>
              <div className="full-bleed">
                <WhatHappensSection />
              </div>
            </Container>
            <div className="tw-space-y-40 tw-mx-auto tw-max-w-full md:tw-max-w-[58.75rem] lg:tw-max-w-[67.5rem] xl:tw-max-w-[80rem] xl:tw-px-0 lg:tw-px-0 sm:tw-px-4  xs:tw-px-4 xxs:tw-px-4 tw-mb-24 tw-mt-12">
              <TrendingSection />
              <RegisterCreatorSection />
              <ShopSection />
              <RegisterBrandSection />
            </div>
          </FooterLayout>
        </div>
      </LandingPageLayout>
    </>
  );
};

export default NewAboutUs;
