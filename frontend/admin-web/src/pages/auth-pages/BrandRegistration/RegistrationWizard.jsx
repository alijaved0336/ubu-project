import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Checkbox,
  Flex,
  Form,
  message,
  Spin,
  Steps,
  theme,
  Typography,
} from "antd";
import "./RegistrationWizard.less";
import RegistrationForm from "./RegistrationForm";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import brandRegistrationSchema from "../../../schemas/brandRegistrationSchema";
import { useTranslation } from "react-i18next";
import useGetBrandQuestionnaireOrInfluencerQuestionnaire from "../../../application-wide/api-gateway-hooks/use-get-brand-questionnaire";

import { useLocation, useNavigate } from "react-router-dom";
import useUpdateUser from "../../../application-wide/api-gateway-hooks/use-update-user";
import RouteBackToSignUpModal from "../../../components/Modals/RouteBackToSignUpModal";
import Loader from "../../../components/Loader";
import { CustomButton, Text as UBUText } from "@src/components";
import { showNotification } from "@src/utils/showNotification";
import { setUpdatedUser } from "@src/store/features/authSlice";
import { useDispatch } from "react-redux";

const RegistrationWizard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { loading, error, value } =
    useGetBrandQuestionnaireOrInfluencerQuestionnaire(true, "brand");
    const [ePlatform, setEPlatform] = useState(false);
  const { Text, Link } = Typography;
  const {
    loading: brandLoading,
    value: brandValue,
    onUpdateUser,
  } = useUpdateUser();
  const location = useLocation();
  const { email } = location?.state || { email: undefined };
  const schema = useMemo(() => brandRegistrationSchema(t,ePlatform), [t,ePlatform]);

  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(schema),
  });
  var { affiliateId, affiliateIdSrNo, productCategoryId, productCategoryIdSrNo } = useMemo(() => {
    if (!value?.data) {
      return { affiliateId: null, productCategoryId: null };
    }
    const affiliate = value.data.find(
      (item) => item.question === "Which affiliate network do you work with?"
    );
    const productCategory = value.data.find(
      (item) => item.question === "Product Category"
    );
    return {
      affiliateId: affiliate?.id || null,
      productCategoryId: productCategory?.id || null,
      affiliateIdSrNo: affiliate.sr_no,
      productCategoryIdSrNo: productCategory.sr_no
    };
  }, [value?.data]);

  const onSubmit = useCallback(
    async (values) => {
      const payload = {
        email: email,
        phone_number: values.phoneNumber,
        address: values.address,
        city: values.city,
        state: values.state,
        zip_code: values.zipCode,
        // type: "brand",
        is_brand: true,
        is_influencer: false,
        is_consumer: false,
        brand: {
          companyName: values.companyName,
          companyWebsite: values.companyWebsite,
          jobTitle: values.jobTitle,
          description: values.description,
        },
        additionalFields: {
          numOfEmp: values?.numOfEmp,

          describe: values?.describe,

          followers: values.followers,
          country: values.country,
          affliatenetwork: {
            questionId: affiliateId,
            srNo: affiliateIdSrNo,
            answer: values.affliatenetwork,
          },
          platform: values.platform,
          sale: values.sale,
          campaign: values.campaign,
          agency: values.agency,
          productsCategogires: {
            questionId: productCategoryId,
            srNo: productCategoryIdSrNo,
            answer: values.productCategories,
          },
        },
      };
      if(values?.ePlatform && payload?.additionalFields?.platform?.answer)
      {
        payload.additionalFields.platform.answer=values?.ePlatform
      }
      
      const response = await onUpdateUser(payload);
      if (response.data) {
        dispatch(setUpdatedUser(response.data));
      }
      if (response.status === 200) {
        form.reset();
        if (response.data.type === "brand") {
          navigate("/dashboard/segments");
        } else {
          navigate("/dashboard/posts");
        }
        // if (response.data.isAdmin) {
        // } else {
        //   navigate("/coming-soon");
        // }
      } else {
        showNotification({
          notificationType: "error",
          message: response.response.data?.error,
          description: response.response.data?.message,
        });
      }
    },
    [productCategoryId, affiliateId]
  );

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = form;

  return (
    <Flex vertical className="brand-wizard" gap="middle">
      {email == undefined && <RouteBackToSignUpModal isOpen={true} />}
      {/* {brandLoading && <Loader />} */}
      <Text className="general-inf-text ff-manrope">General information</Text>
      <Flex>
        <Form
          className="form-container"
          onFinish={handleSubmit(onSubmit)}
          style={{ display: "flex", gap: "24px" }}
        >
          <Flex className="brand-wizard-f">
            <RegistrationForm
              useForm={form}
              onSubmit={onSubmit}
              questionnaire={value?.data}
              watch= {watch}
              setEPlatform={setEPlatform}
            />
          </Flex>
          <Flex vertical className="form-btn" gap="middle">
            <Flex vertical gap="small">
              <Controller
                name="agreeCB"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="brand0-wizard-cb ff-manrope"
                  >
                    I agree to receive communications from UBU
                  </Checkbox>
                )}
              />
              {errors.agreeCB && (
                <Text type="danger">{errors.agreeCB.message}</Text>
              )}

              <Controller
                name="privacyPolicyCB"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    value={field.value}
                    onChange={(checkedValues) => field.onChange(checkedValues)}
                    className="brand0-wizard-cb ff-manrope"
                  >
                    By Checking this box, you agree to UBU{" "}
                    <Link href="/privacypolicy" target="_blank">
                      <Text className="brand0-wizard-cb-text">
                        Privacy Policy
                      </Text>{" "}
                    </Link>
                    and consent to use of the information that it may collect
                    and use about you.
                  </Checkbox>
                )}
              />
              {errors.privacyPolicyCB && (
                <Text type="danger">{errors.privacyPolicyCB.message}</Text>
              )}
            </Flex>
            <Flex style={{ justifyContent: "flex-end" }}>
              <CustomButton
                variant={"black"}
                htmlType="submit"
                style={{ marginTop: "16px", marginBottom: "15px" }}
                loading={brandLoading}
              >
                Submit
              </CustomButton>
            </Flex>
          </Flex>
        </Form>
      </Flex>
    </Flex>
  );
};
export default RegistrationWizard;
