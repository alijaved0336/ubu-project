import cn from "@src/cn";
import { Paragraph } from "@src/components/Common/Typography";
import CustomInput from "@src/components/Input/Input";
import UBUSelect from "@src/components/Select/Select";
import {
  africanCountries,
  antarcticaTerritories,
  asianCountries,
  europeanCountries,
  oceaniaCountries,
  southAmericanCountries,
  usStates,
} from "@src/utils/constant";
import { Checkbox } from "antd";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { Controller } from "react-hook-form";

const stateOptions = usStates.map((state) => ({
  label: state,
  value: state,
}));

const africanCountryOptions = africanCountries.map((country) => ({
  label: country,
  value: country,
}));

const antarcticaTerritoryOptions = antarcticaTerritories.map((territory) => ({
  label: territory,
  value: territory,
}));

const asianCountryOptions = asianCountries.map((country) => ({
  label: country,
  value: country,
}));

const europeanCountryOptions = europeanCountries.map((country) => ({
  label: country,
  value: country,
}));

const oceaniaCountryOptions = oceaniaCountries.map((country) => ({
  label: country,
  value: country,
}));

const southAmericanCountryOptions = southAmericanCountries.map((country) => ({
  label: country,
  value: country,
}));

const FinalStep = ({ errors, control, audienceRegion }) => {
  const { options, placeholder } = useMemo(() => {
    let options = [];
    let placeholder = "";

    switch (audienceRegion) {
      case "northAmerica":
        options = stateOptions;
        placeholder = "Select a State";
        break;

      case "asia":
        options = asianCountryOptions;
        placeholder = "Select a Country";
        break;

      case "europe":
        options = europeanCountryOptions;
        placeholder = "Select a Country";
        break;

      case "africa":
        options = africanCountryOptions;
        placeholder = "Select a Country";
        break;

      case "antarctica":
        options = antarcticaTerritoryOptions;
        placeholder = "Select a Country";
        break;

      case "australia":
        options = oceaniaCountryOptions;
        placeholder = "Select a Country";
        break;

      case "southAmerica":
        options = southAmericanCountryOptions;
        placeholder = "Select a Country";
        break;

      default:
        options = stateOptions;
        placeholder = "Select a State";
    }

    return { options, placeholder };
  }, [audienceRegion]);

  const addressError = errors && errors["address"]?.message;
  const cityError = errors && errors["city"]?.message;
  const stateError = errors && errors["state"]?.message;
  const zipCodeError = errors && errors["zipCode"]?.message;
  const privacyPolicyCBError = errors && errors["privacyPolicyCB"]?.message;

  const hasError =
    addressError ||
    cityError ||
    stateError ||
    zipCodeError ||
    privacyPolicyCBError;

  return (
    <div
      className={cn(
        "tw-py-3 tw-px-4 tw-rounded-[32px] tw-bg-[#FAFAFA] tw-border tw-border-[#FAFAFA]",
        {
          "tw-border-[#ff4d4f]": hasError,
        }
      )}
    >
      <div className="md:tw-w-[737px] tw-h-[calc(100vh-290px)] tw-overflow-auto tw-px-5  tw-space-y-6 tw-custom-scrollbar">
        <Paragraph className="tw-font-bold">Address Details</Paragraph>
        <div className="tw-grid sm:tw-grid-cols-2 tw-grid-cols-1 tw-gap-4">
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <div>
                <CustomInput
                  {...field}
                  status={addressError ? "error" : ""}
                  className="tw-w-full"
                  placeholder="Enter Your Address"
                />
                {addressError && (
                  <Paragraph className="tw-text-sm tw-text-[#ff4d4f] tw-mt-2">
                    {addressError}
                  </Paragraph>
                )}
              </div>
            )}
          />

          <Controller
            name="city"
            control={control}
            status={errors && errors["city"]}
            render={({ field }) => (
              <div>
                <CustomInput
                  {...field}
                  status={cityError ? "error" : ""}
                  className="tw-w-full"
                  placeholder="Enter Your City"
                />
                {cityError && (
                  <Paragraph className="tw-text-sm tw-text-[#ff4d4f] tw-mt-2">
                    {cityError}
                  </Paragraph>
                )}
              </div>
            )}
          />

          <Controller
            name="state"
            control={control}
            status={errors && errors["state"]}
            render={({ field }) => (
              <div>
                <UBUSelect
                  placeholder={placeholder}
                  name={field.name}
                  value={field.value || undefined}
                  onChange={field.onChange}
                  className="tw-h-10 tw-w-full"
                  status={stateError ? "error" : ""}
                  options={options}
                />
                {stateError && (
                  <Paragraph className="tw-text-sm tw-text-[#ff4d4f] tw-mt-2">
                    {stateError}
                  </Paragraph>
                )}
              </div>
            )}
          />

          <Controller
            name="zipCode"
            control={control}
            status={errors && errors["zipCode"]}
            render={({ field }) => (
              <div>
                <CustomInput
                  {...field}
                  status={zipCodeError ? "error" : ""}
                  className="tw-w-full"
                  placeholder="Enter Your Zip Code"
                />
                {zipCodeError && (
                  <Paragraph className="tw-text-sm tw-text-[#ff4d4f] tw-mt-2">
                    {zipCodeError}
                  </Paragraph>
                )}
              </div>
            )}
          />
        </div>
        <Paragraph className="tw-font-bold">
          What level of professionalism (production quality) does your content
          typically have?
        </Paragraph>
        <Paragraph className="tw-text-sm tw-mt-5 tw-text-[#1e1e1eb3]">
          Is there any unique or relevant information about yourself that we
          haven’t asked about, but that you think might help you match with
          potential users and brands? (Optional) Please use the space below to
          share anything you feel could enhance your profile and match you with
          the right opportunities.
        </Paragraph>

        <Controller
          name="additionalInfo"
          control={control}
          render={({ field }) => (
            <CustomInput
              {...field}
              className="tw-w-full"
              placeholder="Additional Information"
            />
          )}
        />

        <div className="tw-mt-3 tw-space-y-6">
          <Paragraph className="tw-font-bold">Summary and Submission</Paragraph>
          <Paragraph className="tw-text-sm tw-text-[#1e1e1eb3]">
            Thank you for joining the UBU Platform and completing your
            onboarding questionnaire!
          </Paragraph>

          <Paragraph className="tw-text-sm tw-text-[#1e1e1eb3]">
            We are thrilled to have you as part of our diverse and vibrant
            community of creators. At UBU, we believe in the power of
            individuality and diversity, and we value the unique perspective you
            bring to our platform. Your responses will help us connect you with
            brands that resonate with your style, values, and audience
          </Paragraph>
          <Paragraph className="tw-font-bold">What Happens Next?</Paragraph>
          <Paragraph className="tw-text-sm tw-text-[#1e1e1eb3]">
            Campaign Matches: When your profile aligns with a brand’s campaign
            requirements, you will be notified via email and within our
            communications module on the platform. This ensures you’re always in
            the loop about potential opportunities.
          </Paragraph>
          <Paragraph className="tw-text-sm tw-text-[#1e1e1eb3]">
            Qualified Match Notifications: Even if you aren’t selected for a
            specific campaign, but your profile matches a significant percentage
            of the brand’s search parameters, we’ll notify you. In these cases,
            you’ll have the opportunity to reach out directly to the brand and
            offer your services, knowing you’re a strong contender for their
            campaign.
          </Paragraph>
          <Paragraph className="tw-text-sm tw-text-[#1e1e1eb3]">
            We appreciate your dedication to your craft and look forward to
            seeing you thrive on the UBU Platform. If you have any questions or
            need further assistance, please don’t hesitate to contact our
            support team.
          </Paragraph>
        </div>

        <Controller
          name="privacyPolicyCB"
          control={control}
          render={({ field }) => (
            <div>
              <Checkbox
                {...field}
                checked={field.value}
                className={cn(
                  "tw-mt-3 tw-p-4 tw-border tw-border-[#1e1e1e33] tw-rounded-xl tw-max-w-[327px] tw-bg-[#FAFAFA]",
                  {
                    "tw-border-[#ff4d4f]": privacyPolicyCBError,
                  }
                )}
              >
                <Paragraph className="tw-ml-5 tw-text-sm tw-text-[#1e1e1eb3]">
                  By Checking this box, you agree to UBU Privacy Policy and
                  consent to the use of the information that it may collect and
                  use about you.
                </Paragraph>
              </Checkbox>

              {privacyPolicyCBError && (
                <Paragraph className="tw-text-sm tw-text-[#ff4d4f] tw-mt-2">
                  {privacyPolicyCBError}
                </Paragraph>
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
};

FinalStep.propTypes = {
  errors: PropTypes.object,
  control: PropTypes.any,
  audienceRegion: PropTypes.string,
};

export default FinalStep;
