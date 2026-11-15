import { Button, Checkbox, Flex, Form, Spin, Typography, Input } from "antd";
import InfluencerLayout from "./Layout";
import "./InfluencerRegistration.less";
import useGetBrandQuestionnaireOrInfluencerQuestionnaire from "../../../application-wide/api-gateway-hooks/use-get-brand-questionnaire";
import InfluencerForm from "./InfluencerForm";
import AdditionalInformationForm from "./AdditionalInformationForm"; // Import the additional form component
import { useTranslation } from "react-i18next";
import influencerRegistrationSchema from "../../../schemas/influencerRegistrationSchema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useMemo } from "react";
import SummaryComponent from "../SummaryAndSubmission";
import useRegistration from "../../../application-wide/api-gateway-hooks/use-registration";
import useCustomNotification from "../../../application-wide/api-gateway-hooks/use-custom-notification";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-use";
import useUpdateUser from "../../../application-wide/api-gateway-hooks/use-update-user";
import { showNotification } from "../../../utils/showNotification";
import Loader from "../../../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { setUpdatedUser } from "@src/store/features/authSlice";
import {
  convertStringsToArrays,
  FLATTEN,
} from "../../../utils/formateFunctions";
import { VALUES_TO_REMOVE } from "../../../utils/constant";

const InfluncerRegistration = ({ data, email }) => {
  const { user } = useSelector((state) => state.auth || {});

  const { Text, Link } = Typography;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [checkedState, setCheckedState] = useState({
    otherReg: false,
    otherCountry: false,
    otherCity: false,
    otherLang:false,
    selectedGender: 0,
    additionalInfo: "",
    otherEth:false,
  });
  const [additionalInfo] = useState();
  const { loading, error, value } =
    useGetBrandQuestionnaireOrInfluencerQuestionnaire(true, "influencer");
  const [geographicLocId, setGeographicLocId] = useState(0);
  const {
    loading: onUpdateUserLoading,
    error: onUpdateUserError,
    onUpdateUser,
  } = useUpdateUser();
  const { openNotification, contextHolder } = useCustomNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const schema = useMemo(
    () => influencerRegistrationSchema(t, value?.data, checkedState),
    [t, value?.data, checkedState]
  );

  const form = useForm({
    resolver: zodResolver(schema),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    trigger,
    watch,
    resetField,
    unregister,
    setValue,
    reset,
  } = form;

  const replaceValues = (obj) => {
    obj["30"] = obj["30"].filter((value) => !VALUES_TO_REMOVE.includes(value));
    obj["4"] = obj["4"].filter((value) => !VALUES_TO_REMOVE.includes(value));
    checkedState.otherEth?obj["3"] =`Ethnicity: ${obj["otherEth"]}`:obj["3"];
    checkedState.otherReg && obj["30"].push("Region:" + obj["otherReg"]);
    checkedState.otherCountry &&
      obj["30"].push("Country:" + obj["otherCountry"]);
    checkedState.otherCity && obj["30"].push("City:"+ obj["otherCity"]);
    checkedState.otherLang && obj["4"].push("Language: "+obj["otherLang"]);
    const { otherReg, otherCountry, otherCity, privacyPolicyCB, ...rest } = obj;
    const flattArray = FLATTEN(value?.data);
    const idAnswers = Object.keys(rest).reduce((acc, srNo) => {
      const question = flattArray.find((q) => q.sr_no === parseInt(srNo));
      if (question) {
        acc[`${question.id}_${question.sr_no}`] = rest[srNo];
      }
      return acc;
    }, {});
    return Object.entries(idAnswers).map(([key, value]) => ({
      questionId: key.split("_")[0],
      answer: value,
      srNo: key.split("_")[1],
    }));
  };

  const onSubmit = async (formData) => {
    const { privacyPolicyCB, address, city, state, zipCode, ...rest } =
      formData;
    formData = replaceValues(rest);
    formData = convertStringsToArrays(formData);

    const payload = {
      influencerAdditionalDto: formData,
      email: state?.usr?.email || email,
      phoneNumber: data?.phoneNumber,
      avatar: data?.avatar,
      address: address,
      city: city,
      state: state,
      zip_code: zipCode,
      instagram_creds: data?.instagram_creds,
      is_influencer: true,

      // type: "influencer",
      influencer: {
        audience_region: data?.audienceRegion || "",
      },
    };
    const response = await onUpdateUser(payload);
    if (response.data) {
      dispatch(setUpdatedUser(response.data));
    }
    if (response.status === 200) {
      showNotification({
        notificationType: "success",
        message: "Successfully Created",
        description: response.message,
      });

      if (user?.isScanned) {
        navigate("/dashboard/posts");
      } else {
        navigate("/qr-Page");
      }
    } else {
      showNotification({
        notificationType: "error",
        message: response.response.data?.error,
        description: response.response.data?.message,
      });
    }
  };

  return (
    <>
      <InfluencerLayout>
        {/* {onUpdateUserLoading && <Loader />} */}
        <Flex vertical className="inf-main">
          <Flex
            vertical
            justify="center"
            align="center"
            gap="middle"
            className="inf-pdiv"
          >
            <Text className="inf-pdiv-text">UBU Onboarding Questionnaire</Text>
            <Text className="inf-pdiv-desc">
              Please fill out the UBU Onboarding Questionnaire as accurately as
              possible. Select all options that resonate with you, as many
              questions allow for multiple answers.
            </Text>
          </Flex>
          <Text style={{fontWeight:"bold"}}>General information </Text>
          <Flex
            gap="large"
            justify="center"
            align="center"
            className="additional-info-flex"
          >
            <Form onFinish={handleSubmit(onSubmit)}>
              <Flex vertical gap="large">
                <AdditionalInformationForm data={data } control={control} errors={errors} />
                <Flex
                  vertical
                  className="inf-form"
                  justify="center"
                  align="center"
                >
                  {loading && !value?.data ? (
                    <Spin />
                  ) : (
                    <InfluencerForm
                      data={value?.data || []}
                      trigger={trigger}
                      errors={errors}
                      control={control}
                      watch={watch}
                      setCheckedState={setCheckedState}
                      unregister={unregister}
                      setValue={setValue}
                      resetField={resetField}
                    />
                  )}
                </Flex>
              </Flex>
            </Form>
          </Flex>
          {/* Last checkbox and button moved outside the boundary */}
          <Flex
            vertical
            className="inf-last-section"
            gap="large"
            align="center"
          >
            <Form onFinish={handleSubmit(onSubmit)}>
              <Flex className="summary-section">
                <Text className="text-main">Additional Information</Text>
                <Text className="summary-desc">
                  Is there any unique or relevant information about yourself
                  that we haven’t asked about, but that you think might help you
                  match with potential users and brands? (Optional) Please use
                  the space below to share anything you feel could enhance your
                  profile and match you with the right opportunities.
                </Text>
                <Input
                  className="input-field"
                  value={checkedState.additionalInfo}
                  placeholder="Additional Information"
                  onChange={(e) => {
                    setCheckedState((prevState) => ({
                      ...prevState,
                      additionalInfo: e.target.value,
                    }));
                  }}
                ></Input>
              </Flex>
              <SummaryComponent />
              <Controller
                name="privacyPolicyCB"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    value={field.value}
                    onChange={(checkedValues) => field.onChange(checkedValues)}
                    className="inf-privacy-cb"
                  >
                    By Checking this box, you agree to UBU{" "}
                    <Link href="/privacypolicy" target="_blank">
                      <Text className="tw-font-bold tw-text-sm">
                        Privacy Policy
                      </Text>{" "}
                    </Link>
                    and consent
                    to the use of the information that it may collect and use
                    about you.
                  </Checkbox>
                )}
              />
              {errors.privacyPolicyCB && (
                <Text type="danger">{errors.privacyPolicyCB.message}</Text>
              )}
              <Flex style={{ justifyContent: "flex-end" }}>
                <Button
                  type="primary"
                  className="inf-submit-btn"
                  htmlType="submit"
                  style={{ marginTop: "15px" }}
                  onClick={() => {
                    handleSubmit(); // Call the submit function
                  }}
                  loading={onUpdateUserLoading}
                >
                  {"Submit"}
                </Button>
              </Flex>
            </Form>
          </Flex>
        </Flex>
      </InfluencerLayout>
    </>
  );
};

export default InfluncerRegistration;
