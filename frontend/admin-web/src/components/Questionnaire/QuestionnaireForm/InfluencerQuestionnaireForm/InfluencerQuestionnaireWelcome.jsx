import React from "react";
import welcomeImage from "@src/assets/questionnaire-welcome.png";
import { Heading, Paragraph } from "@src/components/Common/Typography";
import { Button } from "@src/components/Common/Widgets";
import PropTypes from "prop-types";

const InfluencerQuestionnaireWelcome = ({ onNext, onBack }) => {
  return (
    <div className="tw-min-h-[calc(100vh-104px)] tw-flex tw-flex-col tw-justify-between ">
      <div className="tw-mx-auto">
        <Heading level={2} className="tw-mb-4">
          UBU Onboarding Questionnaire
        </Heading>
        <div className="tw-rounded-[32px] tw-py-5 tw-px-5 tw-bg-[#FAFAFA]  tw-space-y-6 tw-border tw-border-[#FAFAFA] ">
          <div className="md:tw-w-[737px] tw-h-[calc(100vh-290px)] tw-overflow-auto tw-px-5">
            <Paragraph className="tw-max-w-[737px]">
              Please fill out the UBU Onboarding Questionnaire as accurately as
              possible. Select all options that resonate with you, as many
              questions allow for multiple answers. You can always return to
              update your responses.
            </Paragraph>
          </div>
        </div>
      </div>
      <div className="tw-sticky tw-left-0 tw-w-full tw-h-auto tw-bottom-0 tw-bg-white tw-z-10 tw-mx-auto md:tw-w-[737px]">
        <div className="tw-pt-5 tw-pb-3 tw-flex tw-justify-between tw-items-center">
          <Button htmlType="button" variant="outlined" onClick={onBack}>
            Back
          </Button>
          <Button htmlType="button" className="tw-ml-auto" onClick={onNext}>
            Let&apos;s Start
          </Button>
        </div>
      </div>
      {/* <img
        src={welcomeImage}  onClick: PropTypes.func,
        className="tw-w-full tw-h-[inherit] tw-object-cover"
      />

      <div className="tw-bg-black tw-flex tw-flex-col tw-h-full">
        <div className="tw-max-w-[400px] tw-mx-auto tw-my-auto tw-space-y-2">
          <Heading level={1} className="tw-text-white tw-justify-self-center">
            UBU Onboarding Questionnaire
          </Heading>
          <Paragraph className="tw-text-white">
            Please fill out the UBU Onboarding Questionnaire as accurately as
            possible. Select all options that resonate with you, as many
            questions allow for multiple answers. You can always return to
            update your responses.
          </Paragraph>
        </div>
        <div className="tw-border-t tw-border-t-white tw-py-5 tw-px-8 tw-mt-auto">
          <Button variant="outlined" onClick={onClick} className="tw-ml-auto">
            Let's go!
          </Button>
        </div>
      </div> */}
    </div>
  );
};

InfluencerQuestionnaireWelcome.propTypes = {
  onNext: PropTypes.func,
  onBack: PropTypes.func,
};

export default InfluencerQuestionnaireWelcome;
