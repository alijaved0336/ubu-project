import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal, Button, Input, Flex, Spin, Skeleton } from "antd";
import Loader from "../../components/Loader";

import "./inf-signup.less"; // Make sure to create this CSS file
import instagram from "../../assets/Instagram_icon.png";
import screen2 from "../../assets/influncer-screen-2.png";
import InfluncerRegistration from "../auth-pages/InfluencerRegistration/index";
import LandingPageLayout from "../layouts/LandingPageLayout";
import RouteBackToSignUpModal from "../../components/Modals/RouteBackToSignUpModal";
import axiosInstance from "../../application-wide/axios/axios-instance";
import { useSelector } from "react-redux";
import InfluencerQuestionnaireForm from "@src/components/Questionnaire/QuestionnaireForm/InfluencerQuestionnaireForm/InfluencerQuestionnaireForm";
import { useInfluencerQuestionnaireForm } from "@src/components/Questionnaire/QuestionnaireForm/InfluencerQuestionnaireForm/InfluencerQuestionnaireFormProvider";
import cn from "@src/cn";
import InfluencerQuestionnaireWelcome from "@src/components/Questionnaire/QuestionnaireForm/InfluencerQuestionnaireForm/InfluencerQuestionnaireWelcome";
import getInfluencerQuestionnaireValidationSchema from "@src/components/Questionnaire/QuestionnaireForm/InfluencerQuestionnaireForm/validationSchema";
import { t } from "i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getDefaultValues } from "@src/components/Questionnaire/QuestionnaireForm/InfluencerQuestionnaireForm/helpers";

function InfSignup() {
  const { user } = useSelector((state) => state.auth || {});
  const location = useLocation();

  const {
    questionnaireData,
    otherStates,
    inputOptions,
    selectedGender,
    isEditing,
    isLoadingQuestionnaire
  } = useInfluencerQuestionnaireForm();

  const schema = useMemo(() => {
    return getInfluencerQuestionnaireValidationSchema(
      t,
      questionnaireData?.questionnaire ?? [],
      otherStates,
      inputOptions,
      selectedGender
    );
  }, [questionnaireData, selectedGender, otherStates, inputOptions]);

  const questionnaireForm = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    values: getDefaultValues(
      questionnaireData?.questionnaire,
      questionnaireData?.userInfo,
      otherStates,
      isEditing
    ),
  });

  const [instagramConnected, setInstagramConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    language: "",
    audienceRegion:
      questionnaireData?.userInfo?.influencer?.audience_region || "",
    experience: {
      earnedContent: "",
      postingFrequency: "",
    },
    avatar: null,
  });
  
  useEffect(() => {
    if (questionnaireData?.userInfo?.influencer?.audience_region) {
      setFormData((prev) => ({
        ...prev,
        audienceRegion: questionnaireData.userInfo.influencer.audience_region,
      }));
    }
  }, [questionnaireData?.userInfo]);

  const { state } = location;
  let email = user?.email ?? "";

  const navigate = useNavigate();

  useEffect(() => {
    const getAccessToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const state = params.get("state");
      if (code) {
        setIsLoading(true);
        const savedState = JSON.parse(localStorage.getItem("signupFormState"));

        email = savedState?.email ?? undefined;

        giveAccessToken(code, savedState.formData);
        if (savedState) {
          setFormData(savedState.formData);
          setCurrentStep(savedState.currentStep);
          setInstagramConnected(true);
        }
      }
    };
    getAccessToken();
  }, []);

  const giveAccessToken = async (code, formData) => {
    const response = await axiosInstance.get(
      `/instagram/callback?code=${code}&state=user_id=user_id`
    );
    if (response.data.accessToken) {
      setIsLoading(false);
      setFormData({ ...formData, instagram_creds: response.data });
    }
  };

  const steps = [
    {
      image: screen2,
      form: (
        formData,
        handleInputChange,
        handleFileChange,
        errors,
        handleInstagramConnect,
        instagramConnected
      ) => (
        <Flex vertical gap={"1rem"}>
          <Flex vertical gap={".5rem"}>
            <label htmlFor="audienceRegion ff-manrope">Audience Region</label>
            { (isEditing && isLoadingQuestionnaire) ? <Skeleton.Input
              active
              size="large"
              style={{ width: "100%", height: '50px', marginBottom: "16px" }}
              block
            /> :
            <select
              id="audienceRegion"
              name="audienceRegion"
              value={formData.audienceRegion}
              onClick={() => questionnaireForm.setValue("state", "")}
              onChange={handleInputChange}
              className="input-field ff-manrope"
            >
              <option value="" disabled>
                What is your audience region?
              </option>
              <option value="northAmerica">North America</option>
              <option value="europe">Europe</option>
              <option value="asia">Asia</option>
              <option value="africa">Africa</option>
              <option value="antarctica">Antarctica</option>
              <option value="australia">Australia</option>
              <option value="southAmerica">South America</option>
            </select>
            }
          </Flex>
          {/* <Flex vertical className="instagram-connect-container">
            <Button
              type="button"
              className="instagram-connect-button ff-manrope"
              onClick={handleInstagramConnect}
              loading={isLoading}
            >
              <div className="instagram-icon">
                <img
                  src={instagram}
                  alt="Instagram"
                  className="instagram-icon"
                />
              </div>
              <div className="instagram-text ff-manrope">
                {instagramConnected ? "Connected" : "Connect with Instagram"}
              </div>
            </Button>
            {errors.instagram && (
              <div className="error-text ff-manrope">{errors.instagram}</div>
            )}
          </Flex>
          <div
            style={{
              width: "100%",
              color: "#94A3B8",
              fontSize: "14px",
              fontFamily: "Manrope",
              fontWeight: "500",
              lineHeight: "20px",
              letterSpacing: "0.07px",
              wordWrap: "break-word",
              padding: "5px",
            }}
          >
            Note: this button will redirect to instagram and first take access
            to user profile and then business permissions
          </div> */}
        </Flex>
      ),
    },
    {
      form: () => (
        <div>
          <InfluencerQuestionnaireWelcome
            onNext={() => setCurrentStep((prev) => prev + 1)}
            onBack={() => setCurrentStep((prev) => prev - 1)}
          />
        </div>
      ),
    },
    {
      form: (formData) => (
        <div>
          <InfluencerQuestionnaireForm
            audienceRegion={formData?.audienceRegion}
            form={questionnaireForm}
            onBack={() => setCurrentStep((prev) => prev - 1)}
          />
        </div>
      ),
    },
  ];

  const nextStep = async (e) => {
    if (!instagramConnected) {
      setErrors((prev) => {
        return {
          ...prev,
          instagram: "*Instagram connection is required.",
        };
      });
    } else {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const prevStep = () => setCurrentStep((prevStep) => prevStep - 1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    }
    const nameParts = name.split(".");
    if (nameParts.length > 1) {
      setFormData((prevData) => ({
        ...prevData,
        [nameParts[0]]: {
          ...prevData[nameParts[0]],
          [nameParts[1]]: value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      avatar: file,
    }));
  };

  const handleInstagramConnect = () => {
    // Save current state and step to localStorage
    setIsLoading(true);
    localStorage.setItem(
      "signupFormState",
      JSON.stringify({ formData, currentStep, isLoading, email })
    );
    // Redirect to Instagram OAuth URL
    window.location.href =
      "https://www.instagram.com/oauth/authorize?&client_id=860874329475052&redirect_uri=https://ubu.live/registration/creator&response_type=code&scope=instagram_business_basic%2Cinstagram_business_content_publish";
  };

  const handleOk = () => {
    setIsModalVisible(false);
    if (
      modalMessage ===
      "You have successfully registered. Please login to continue."
    ) {
      navigate("/login"); // Navigate to login page
    }
  };

  return (
    <LandingPageLayout>
      {!email && <RouteBackToSignUpModal isOpen={true} />}

      <div className="app">
        <div
          className={cn("md:tw-px-10 md:tw-pt-10 tw-px-5 tw-pt-5", {
            "tw-block": currentStep > 0,
            "tw-flex  tw-justify-between tw-h-[calc(100vh-64px)] md:tw-flex-row tw-flex-col":
              currentStep === 0,
          })}
        >
          {currentStep === 0 && (
            <>
              <div className="vertical-text-container">
                <div className="vertical-text ff-manrope">Apply to be an</div>
                <div className="vertical-text-1 ff-manrope">UBU CREATOR</div>
              </div>
              <div className="image-section md:tw-order-1 tw-order-2">
                <img
                  src={steps[currentStep].image}
                  alt={`Step ${currentStep + 1}`}
                />
              </div>
            </>
          )}
          <div
            className={cn({
              "form-section md:tw-order-2 tw-order-1 md:tw-self-start tw-self-center":
                currentStep === 0,
              "form-section2 ": currentStep > 0,
            })}
          >
            {/* <div
              className={` ${
                currentStep === 0 ? "steps-indicator" : "  steps-indicator2 "
              } `}
              // className="steps-indicator"
            >
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`step ${index <= currentStep ? "active" : ""}  `}
                >
                  {index + 1}
                </div>
              ))}
            </div> */}
            {/* <form onSubmit={currentStep === steps.length - 1 ? handleSubmit : nextStep}> */}{" "}
            {/* <h2 className="ff-manrope">
              Tell us about{" "}
              {
                currentStep === 0
                  ? "yourself"
                  : currentStep === 1 && "your social channels"
                // : 'your experience'
              }
              {currentStep == 2 ? "your exprience" : ""}
            </h2> */}
            {steps[currentStep].form(
              formData,
              handleInputChange,
              handleFileChange,
              errors,
              handleInstagramConnect,
              instagramConnected
            )}
            {currentStep === 0 && (
              <div className="buttons-container">
                <button
                  type="button"
                  className="button next ff-manrope"
                  onClick={nextStep}
                  disabled={isLoading || (isEditing && isLoadingQuestionnaire)}
                >
                  {(isEditing && isLoadingQuestionnaire) ? 'Loading...' : 'Next'} 
                </button>
              </div>
            )}
            {/* </form> */}
          </div>
        </div>
        <Modal
          title={
            modalMessage.includes("successfully")
              ? "Registration Successful"
              : "Error"
          }
          visible={isModalVisible}
          onOk={handleOk}
          footer={[
            <Button key="submit" type="primary" onClick={handleOk}>
              {modalMessage.includes("successfully") ? "Login" : "OK"}
            </Button>,
          ]}
        >
          <p>{modalMessage}</p>
        </Modal>
      </div>
    </LandingPageLayout>
  );
}

export default InfSignup;
