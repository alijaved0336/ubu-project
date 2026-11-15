import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Flex, Radio } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

import "./ChooseSignUp.less";
import LandingPageLayout from "../../layouts/LandingPageLayout";
import RouteBackToSignUpModal from "../../../components/Modals/RouteBackToSignUpModal";
import EmailCaptureModal from "../../../components/Modals/EmailCaptureModal";
import { AuthLayoutV2 } from "@src/layouts";
import { Text, CustomButton } from "@src/components";
import { useSelector } from "react-redux";
import DOBCaptureModal from '../../../components/Modals/DOBCaptureModal';
import useAuthUser from '../../../application-wide/api-gateway-hooks/use-auth-user';
import { useDispatch } from "react-redux";
import { setCredentials } from "@src/store/features/authSlice";

const ChooseSignUp = () => {
  const { user } = useSelector((state) => state.auth || {});
  // const { Text } = Typography;

  const { t } = useTranslation();
  const navigate = useNavigate();
  const [radioValue, setRadioValue] = useState(1);
  const location = useLocation();
  const { state } = location;
  const email = user?.email ?? undefined;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch();
  const [isDOBModalVisible, setIsDOBModalVisible] = useState(false);
  
  useEffect(() => {
    if (user) {
      setIsDOBModalVisible(user && !user?.user?.dob && user?.user?.dob===null ? true : false)
    }
  }, [user])

  const onSubmit = () => {
    if (radioValue === 1) {
      navigate("/registration/brand", { state: { email } });
    } else if (radioValue === 2) {
      navigate("/registration/creator", { state: { email } });
    } else {
      setIsModalVisible(true);
    }
  };

  const handleDOBSuccess = async (updatedUserData) => {
    try {
      dispatch(setCredentials(updatedUserData));
    } catch (error) {
      console.error(error);
    }
  };

  const onRadioChange = (e) => {
    setRadioValue(e.target.value);
  };

  useEffect(() => {
    if (user?.isConsumer) {
      navigate("/registration/creator", { state: { email } });
    }
  }, [user, navigate, email]);

  return (
    <LandingPageLayout>
      {email == undefined && <RouteBackToSignUpModal isOpen={true} />}
      <EmailCaptureModal
        key={isModalVisible}
        isOpen={isModalVisible}
        setIsOpen={setIsModalVisible}
      />

      <DOBCaptureModal
        isOpen={isDOBModalVisible}
        setIsOpen={setIsDOBModalVisible}
        onSuccess={handleDOBSuccess}
      />

      <AuthLayoutV2>
        <Flex gap="small" className="choose-p-flex2 ChoiceForm">
          <Flex className="choose-auth-1">
            <Flex vertical gap={"2rem"} className="choose-auth-form">
              <Flex vertical gap={"1rem"}>
                <Text mainHeading className="fs-24 fw-400 text-center">
                  Continue as
                </Text>
                {/* <Text className="fs-14 fw-400 text-greyscale-500 text-center">
                  Choose to stay as a brand owner or transition to an influencer
                  role.
                </Text> */}
              </Flex>
              <Radio.Group
                className="choose-radio"
                onChange={onRadioChange}
                value={radioValue}
              >
                <Radio value={1} className="choose-radio-item">
                  <Text className={"fs-16 fw-600"}>Business</Text>
                </Radio>
                <Radio value={2} className="choose-radio-item">
                  <Text className={"fs-16 fw-600"}>Creator</Text>
                </Radio>
                <Radio value={3} className="choose-radio-item">
                  <Text className={"fs-16 fw-600"}>Shopper</Text>
                </Radio>
              </Radio.Group>
              <CustomButton
                shape={"round-md"}
                variant={"black lg"}
                onClick={onSubmit}
              >
                Continue
              </CustomButton>
            </Flex>
          </Flex>
        </Flex>
      </AuthLayoutV2>
    </LandingPageLayout>
  );
};

export default memo(ChooseSignUp);
