import {
  Button,
  Checkbox,
  Col,
  Flex,
  Form,
  Input,
  Radio,
  Row,
  Spin,
  Typography,
  Select,
} from "antd";
import { usStates } from "../../../utils/constant";
import "./RegistrationForm.less";
import { Controller } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import { useDebounce } from "react-use";
import {
  CloseOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  CheckOutlined,
} from "@ant-design/icons"; // Import check icon
import { useCallback, useEffect, useMemo, useState } from "react";
import axiosInstance from "../../../application-wide/axios/axios-instance";
import TextArea from "antd/es/input/TextArea";

const RegistrationForm = ({
  questionnaire,
  useForm,
  onSubmit,
  setEPlatform,
}) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState({});

  const [debouncedVal, setDebouncedValue] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const {
    control,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm;
  console.log({ errors });
  let field = {};
  const watchField = useMemo(() => {
    if (questionnaire) {
      field = watch("platform");
      return field;
    }
    return {};
  }, [questionnaire, field]);

  const { Text } = Typography;
  const {
    numOfEmp,
    describeYourSelf,
    socialFollowers,
    region,
    affilateNetwork,
    eccomercePlatform,
    annualSales,
    productCategories,
    runCampigns,
    campaignEmployees,
  } = useMemo(() => {
    const numOfEmp =
      questionnaire?.length &&
      questionnaire.find(
        (value) =>
          value.question === "How many employees do you have?" ||
          value.title === "How many employees do you have?"
      );

    const describeYourSelf =
      questionnaire?.length &&
      questionnaire.find(
        (value) =>
          value.question === "How would you best describe yourself?" ||
          value.title === "How would you best describe yourself?"
      );

    const socialFollowers =
      questionnaire?.length &&
      questionnaire.find(
        (value) =>
          value.question ===
            "How many total social followers does your brand have on a major social channel, such as Instagram or TikTok? (Our team will verify this information.)" ||
          value.title ===
            "How many total social followers does your brand have on a major social channel, such as Instagram or TikTok? (Our team will verify this information.)"
      );
    const region =
      questionnaire?.length &&
      questionnaire.find(
        (value) =>
          value.question ===
            "Which Country/region Is Your Company Located In?" ||
          value.title === "Which Country/region Is Your Company Located In?"
      );
    const affilateNetwork =
      questionnaire?.length &&
      questionnaire.find(
        (value) =>
          value.question === "Which affiliate network do you work with?" ||
          value.title === "Which affiliate network do you work with?"
      );
    const eccomercePlatform =
      questionnaire?.length &&
      questionnaire.find(
        (value) =>
          value.question === "Do you currently use an e-commerce platform?" ||
          value.title === "Do you currently use an e-commerce platform?"
      );
    const annualSales =
      questionnaire?.length &&
      questionnaire.find(
        (value) =>
          value.question === "Annual Online Sales" ||
          value.title === "Annual Online Sales"
      );
    const productCategories =
      questionnaire?.length &&
      questionnaire.find(
        (value) =>
          value.question === "Product Category" ||
          value.title === "Product Category"
      );
    const runCampigns =
      questionnaire?.length &&
      questionnaire.find(
        (value) =>
          value.question ===
            "Are you interested in paying creators to run campaigns specifically for your brand?" ||
          value.title ===
            "Are you interested in paying creators to run campaigns specifically for your brand?"
      );
    const campaignEmployees =
      questionnaire?.length &&
      questionnaire.find(
        (value) =>
          value.question ===
            "How many employees or agencies will be involved in planning and executing creator campaigns?" ||
          value.title ===
            "How many employees or agencies will be involved in planning and executing creator campaigns?"
      );

    return {
      numOfEmp,
      describeYourSelf,
      socialFollowers,
      region,
      affilateNetwork,
      eccomercePlatform,
      annualSales,
      productCategories,
      runCampigns,
      campaignEmployees,
    };
  }, [questionnaire]);

  return (
    <>
      {/* <Form
            name="form-container"
            className="brand-form"
            onFinish={handleSubmit(onSubmit)}
        > */}
      <Flex className="brand-form">
        {questionnaire?.length > 0 ? (
          <Flex vertical className="brand-registration-flex" gap="large">
            <Flex gap="middle" vertical className="brand-f">
              <Flex
                gap="large"
                justify="end"
                align="center"
                className="brand-f-f1"
              >
                <Controller
                  name="companyName"
                  control={control}
                  render={({ field }) => (
                    <Flex vertical className="input-flex">
                      <Input
                        {...field}
                        className="input"
                        placeholder="Company Name*"
                      />
                      {errors.companyName && (
                        <Text type="danger">{errors.companyName.message}</Text>
                      )}
                    </Flex>
                  )}
                />
                <Controller
                  name="companyWebsite"
                  control={control}
                  render={({ field }) => (
                    <Flex vertical className="input-flex">
                      <Input
                        {...field}
                        className="input"
                        placeholder="Company Website*"
                      />
                      {errors.companyWebsite && (
                        <Text type="danger">
                          {errors.companyWebsite.message}
                        </Text>
                      )}
                    </Flex>
                  )}
                />
              </Flex>
              <Flex
                gap="large"
                justify="end"
                align="center"
                className="brand-f-f1"
              >
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <Flex vertical className="input-flex">
                      <Input
                        {...field}
                        className="input"
                        placeholder="Phone Number*"
                      />
                      {errors.phoneNumber && (
                        <Text type="danger">{errors.phoneNumber.message}</Text>
                      )}
                    </Flex>
                  )}
                />
                <Controller
                  name="jobTitle"
                  control={control}
                  render={({ field }) => (
                    <Flex vertical className="input-flex">
                      <Input
                        {...field}
                        className="input"
                        placeholder="Job Title*"
                      />
                      {errors.jobTitle && (
                        <Text type="danger">{errors.jobTitle.message}</Text>
                      )}
                    </Flex>
                  )}
                />
              </Flex>
              <Flex
                gap="large"
                justify="end"
                align="center"
                className="brand-f-f1"
              >
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <Flex vertical className="input-flex">
                      <Input
                        {...field}
                        placeholder="Address*"
                        className="input"
                      />
                      {errors.address && (
                        <Text type="danger">{errors.address.message}</Text>
                      )}
                    </Flex>
                  )}
                />
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <Flex vertical className="input-flex">
                      <Input {...field} placeholder="City*" className="input" />
                      {errors.city && (
                        <Text type="danger">{errors.city.message}</Text>
                      )}
                    </Flex>
                  )}
                />
              </Flex>

              <Flex
                gap="large"
                justify="end"
                align="center"
                className="brand-f-f1"
              >
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <Flex vertical className="input-flex reset-padding">
                      <Select
                        {...field}
                        placeholder="Select State*"
                        className="input"
                      >
                        {usStates.map((state) => (
                          <Option key={state} value={state}>
                            {state}
                          </Option>
                        ))}
                      </Select>
                      {errors.state && (
                        <Text type="danger">{errors.state.message}</Text>
                      )}
                    </Flex>
                  )}
                />
                <Controller
                  name="zipCode"
                  control={control}
                  render={({ field }) => (
                    <Flex vertical className="input-flex">
                      <Input
                        {...field}
                        placeholder="Zip Code*"
                        className="input"
                      />
                      {errors.zipCode && (
                        <Text type="danger">{errors.zipCode.message}</Text>
                      )}
                    </Flex>
                  )}
                />
              </Flex>
              <Flex
                gap="large"
                justify="end"
                align="center"
                className="brand-f-f1"
              >
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Flex vertical className="input-flex">
                      <Input.TextArea
                        {...field}
                        className="input textarea"
                        placeholder="Description*"
                        rows={4}
                      />
                      {errors.description && (
                        <Text type="danger">{errors.description.message}</Text>
                      )}
                    </Flex>
                  )}
                />
              </Flex>  

            </Flex>
            <Flex vertical className="brand-radio-numofemp" gap="small">
              <Flex>
                <Text className="brand-radio-numofemp-text ff-manrope">
                  {numOfEmp && (numOfEmp.question || numOfEmp.title)}
                </Text>
              </Flex>
              <Flex>
                <Radio.Group className="brand-radio-numofemp-row">
                  {numOfEmp.options.map((employe) => (
                    <Flex key={employe} className="brand-radio-numofemp-item ">
                      <Controller
                        name="numOfEmp"
                        control={control}
                        render={({ field }) => (
                          <Radio
                            {...field}
                            onChange={(e) => {
                              setValue(
                                "numOfEmp.questionId",
                                questionnaire[0]?.id,
                                { shouldValidate: true }
                              );
                              setValue(
                                "numOfEmp.srNo",
                                numOfEmp.sr_no,
                                { shouldValidate: true }
                              );
                              setValue("numOfEmp.answer", e.target.value, {
                                shouldValidate: true,
                              });
                              trigger("numOfEmp");
                            }}
                            className="brand-radio-numofemp-row-cb ff-manrope"
                            value={employe}
                          >
                            {employe}
                          </Radio>
                        )}
                      />
                    </Flex>
                  ))}
                </Radio.Group>
              </Flex>
              {errors.numOfEmp && (
                <Text className="ff-manrope" type="danger">
                  {errors.numOfEmp.message}
                </Text>
              )}
            </Flex>

            <Flex vertical className="brand-radio-describeyourself" gap="small">
              <Flex>
                <Text className="brand-radio-describeyourself-text ff-manrope">
                  {describeYourSelf &&
                    (describeYourSelf.question || describeYourSelf.title)}
                </Text>
              </Flex>
              <Flex>
                <Radio.Group className="brand-radio-describeyourself-row">
                  {describeYourSelf?.options.map((describe) => (
                    <Flex
                      key={describe}
                      className="brand-radio-describeyourself-item"
                    >
                      <Controller
                        name="describe"
                        control={control}
                        render={({ field }) => (
                          <Radio
                            {...field}
                            type="radio"
                            onChange={(e) => {
                              setValue(
                                "describe.questionId",
                                describeYourSelf?.id,
                                { shouldValidate: true }
                              );
                              setValue(
                                "describe.srNo",
                                describeYourSelf.sr_no,
                                { shouldValidate: true }
                              );
                              setValue("describe.answer", e.target.value, {
                                shouldValidate: true,
                              });
                              trigger("describe");
                            }}
                            className="brand-radio-describeyourself-row-cb ff-manrope"
                            value={describe}
                          >
                            {describe}
                          </Radio>
                        )}
                      />
                    </Flex>
                  ))}
                </Radio.Group>
              </Flex>
              {errors.describe && (
                <Text className="ff-manrope" type="danger">
                  {errors.describe.message}
                </Text>
              )}
            </Flex>

            <Flex vertical className="brand-radio-totalFollowers" gap="small">
              <Flex>
                <Text className="brand-radio-totalFollowers-text ff-manrope">
                  {socialFollowers &&
                    (socialFollowers.question || socialFollowers.title)}
                </Text>
              </Flex>
              <Flex>
                <Radio.Group className="brand-radio-totalFollowers-row">
                  {socialFollowers?.options.map((followers) => (
                    <Flex
                      key={followers}
                      className="brand-radio-totalFollowers-item"
                    >
                      <Controller
                        name="followers"
                        control={control}
                        render={({ field }) => (
                          <Radio
                            {...field}
                            onChange={(e) => {
                              setValue(
                                "followers.questionId",
                                socialFollowers?.id,
                                { shouldValidate: true }
                              );
                              setValue(
                                "followers.srNo",
                                socialFollowers.sr_no,
                                { shouldValidate: true }
                              );
                              setValue("followers.answer", e.target.value, {
                                shouldValidate: true,
                              });
                              trigger("followers");
                            }}
                            className="brand-radio-totalFollowers-row-cb ff-manrope"
                            value={followers}
                          >
                            {followers}
                          </Radio>
                        )}
                      />
                    </Flex>
                  ))}
                </Radio.Group>
              </Flex>
              {errors.followers && (
                <Text className="ff-manrope" type="danger">
                  {errors.followers.message}
                </Text>
              )}
            </Flex>
            <Flex vertical className="brand-radio-countries" gap="small">
              <Flex>
                <Text className="brand-radio-countries-text ff-manrope">
                  {region && (region?.question || region?.title)}
                </Text>
              </Flex>
              <Flex>
                <Radio.Group className="brand-radio-countries-row">
                  {region?.options.map((country) => (
                    <Flex key={country} className="brand-radio-countries-item">
                      <Controller
                        name="country"
                        control={control}
                        render={({ field }) => (
                          <Radio
                            {...field}
                            onChange={(e) => {
                              setValue("country.questionId", region?.id, {
                                shouldValidate: true,
                              });
                              setValue(
                                "country.srNo",
                                region.sr_no,
                                { shouldValidate: true }
                              );
                              setValue("country.answer", e.target.value, {
                                shouldValidate: true,
                              });
                              trigger("country");
                            }}
                            className="brand-radio-countries-row-cb ff-manrope"
                            value={country}
                          >
                            {country}
                          </Radio>
                        )}
                      />
                    </Flex>
                  ))}
                </Radio.Group>
              </Flex>
              {errors.country && (
                <Text className="ff-manrope" type="danger">
                  {errors.country.message}
                </Text>
              )}
            </Flex>

            <Flex vertical className="brand-radio2-affliatenetwork" gap="large">
              <Flex>
                <Text className="brand-radio2-affliatenetwork-text ff-manrope">
                  {affilateNetwork &&
                    (affilateNetwork.question || affilateNetwork.title)}
                </Text>
              </Flex>
              <Flex className="brand-radio2-affliatenetwork-row">
                <Controller
                  name="affliatenetwork"
                  control={control}
                  render={({ field }) => (
                    <Checkbox.Group
                      value={field.value}
                      onChange={(checkedValues) =>
                        field.onChange(checkedValues)
                      }
                      className="brand-radio2-affliatenetwork-row"
                    >
                      {affilateNetwork?.options.map((affliatenetwork) => (
                        <Flex
                          key={affliatenetwork}
                          className="brand-radio2-affliatenetwork-item"
                        >
                          <Checkbox
                            value={affliatenetwork}
                            className="brand-cbs-row-cb ff-manrope"
                          >
                            {affliatenetwork}
                          </Checkbox>
                        </Flex>
                      ))}
                    </Checkbox.Group>
                  )}
                />
                {watch("affliatenetwork")?.answer === "Other" && (
                  <Controller
                    name="affliatenetworkValues"
                    control={control}
                    render={({ field }) => (
                      <Flex vertical className="input-flex">
                        <Input
                          {...field}
                          className="input-1"
                          placeholder="Enter Affiliate Network Name"
                        />
                        {errors.affliatenetworkValues && (
                          <Text type="danger">
                            {errors.affliatenetworkValues.message}
                          </Text>
                        )}
                      </Flex>
                    )}
                  />
                )}
              </Flex>
              {errors.affliatenetwork && (
                <Text className="ff-manrope" type="danger">
                  {errors.affliatenetwork.message}
                </Text>
              )}
            </Flex>

            <Flex vertical className="brand-radio-currentPlatform" gap="small">
              <Flex>
                <Text className="brand-radio-currentPlatform-text ff-manrope">
                  {eccomercePlatform &&
                    (eccomercePlatform?.question || eccomercePlatform?.title)}
                </Text>
              </Flex>
              <Flex vertical>
                <Radio.Group className="brand-radio-currentPlatform-row">
                  {eccomercePlatform?.options.map((platform, index) => (
                    <Flex
                      key={platform}
                      className="brand-radio-currentPlatform-item"
                      gap="small"
                    >
                      <Controller
                        name="platform.answer"
                        control={control}
                        render={({ field }) => (
                          <Radio
                            {...field}
                            onChange={(e) => {
                              e.target.value === "Yes"
                                ? setEPlatform(true)
                                : setEPlatform(false);
                              setValue(
                                "platform.questionId",
                                eccomercePlatform?.id,
                                {
                                  shouldValidate: true,
                                }
                              );
                              setValue(
                                "platform.srNo",
                                eccomercePlatform.sr_no,
                                { shouldValidate: true }
                              );
                              setValue("platform.answer", e.target.value, {
                                shouldValidate: true,
                              });
                              trigger("platform");
                            }}
                            className="brand-radio-currentPlatform-row-cb ff-manrope"
                            value={platform}
                          >
                            {platform}
                          </Radio>
                        )}
                      />
                      {index === 0 &&
                        watchField &&
                        watchField?.answer == "Yes" && (
                          <Flex style={{display:"flex", flexDirection:"column"}}>
                            <Controller
                              name="ePlatform"
                              control={control}
                              render={({ field }) => (
                                <Flex vertical>
                                  <Input
                                    {...field}
                                    placeholder="Enter your E-Commerce platform"
                                    className={
                                      errors?.ePlatform?.message
                                        ? "ePlatformError"
                                        : "ePlatform"
                                    }
                                  />
                                </Flex>
                              )}
                            />
                            {errors?.ePlatform && (
                              <Text className="ff-manrope" type="danger">
                                {errors?.ePlatform?.message}
                              </Text>
                            )}
                          </Flex>
                        )}
                    </Flex>
                  ))}
                </Radio.Group>
              </Flex>
              {errors?.platform?.answer && (
                <Text className="ff-manrope" type="danger">
                  {errors?.platform?.answer?.message}
                </Text>
              )}
            </Flex>
            <Flex vertical className="brand-radio-annualSales" gap="small">
              <Flex>
                <Text className="brand-radio-annualSales-text ff-manrope">
                  {annualSales && (annualSales?.question || annualSales?.title)}
                </Text>
              </Flex>
              <Flex>
                <Radio.Group className="brand-radio-annualSales-row">
                  {annualSales?.options.map((sale) => (
                    <Flex key={sale} className="brand-radio-annualSales-item">
                      <Controller
                        name="sale"
                        control={control}
                        render={({ field }) => (
                          <Radio
                            {...field}
                            onChange={(e) => {
                              setValue("sale.questionId", annualSales.id, {
                                shouldValidate: true,
                              });
                              setValue("sale.srNo", annualSales.sr_no, {
                                shouldValidate: true,
                              });
                              setValue("sale.answer", e.target.value, {
                                shouldValidate: true,
                              });
                              trigger("sale");
                            }}
                            className="brand-radio-annualSales-row-cb ff-manrope"
                            value={sale}
                          >
                            {sale}
                          </Radio>
                        )}
                      />
                    </Flex>
                  ))}
                </Radio.Group>
              </Flex>
              {errors.sale && (
                <Text className="ff-manrope" type="danger">
                  {errors.sale.message}
                </Text>
              )}
            </Flex>
            <Flex vertical className="brand-cbs-productCategories" gap="large">
              <Flex>
                <Text className="brand-cbs-productCategories-text ff-manrope">
                  {productCategories &&
                    (productCategories?.question || productCategories?.title)}
                </Text>
              </Flex>
              <Flex className="brand-cbs-productCategories-row">
                <Controller
                  name="productCategories"
                  control={control}
                  render={({ field }) => (
                    <Checkbox.Group
                      value={field.value}
                      onChange={(checkedValues) =>
                        field.onChange(checkedValues)
                      }
                      className="brand-cbs-productCategories-row"
                    >
                      {productCategories?.options.map((productCategories) => (
                        <Flex
                          key={productCategories}
                          className="brand-cbs-productCategories-item"
                        >
                          <Checkbox
                            value={productCategories}
                            className="brand-cbs-row-cb ff-manrope"
                          >
                            {productCategories}
                          </Checkbox>
                        </Flex>
                      ))}
                    </Checkbox.Group>
                  )}
                />
              </Flex>
              {errors.productCategories && (
                <Text className="ff-manrope" type="danger">
                  {errors.productCategories.message}
                </Text>
              )}
            </Flex>
            <Flex vertical className="brand-radio-runCampigns" gap="small">
              <Flex>
                <Text className="brand-radio-runCampigns-text ff-manrope">
                  {runCampigns && (runCampigns?.question || runCampigns?.title)}
                </Text>
              </Flex>
              <Flex>
                <Radio.Group className="brand-radio-runCampigns-row">
                  {runCampigns?.options.map((campaign) => (
                    <Flex
                      key={campaign}
                      className="brand-radio-runCampigns-item"
                    >
                      <Controller
                        name="campaign"
                        control={control}
                        render={({ field }) => (
                          <Radio
                            {...field}
                            onChange={(e) => {
                              setValue("campaign.questionId", runCampigns?.id, {
                                shouldValidate: true,
                              });
                              setValue("campaign.srNo", runCampigns?.sr_no, {
                                shouldValidate: true,
                              });
                              setValue("campaign.answer", e.target.value, {
                                shouldValidate: true,
                              });
                              trigger("campaign");
                            }}
                            className="brand-radio-runCampigns-row-cb ff-manrope"
                            value={campaign}
                          >
                            {campaign}
                          </Radio>
                        )}
                      />
                    </Flex>
                  ))}
                </Radio.Group>
              </Flex>
              {errors.campaign && (
                <Text className="ff-manrope" type="danger">
                  {errors.campaign.message}
                </Text>
              )}
            </Flex>
            <Flex
              vertical
              className="brand-radio-numOfAgenciesforCampaigns"
              gap="small"
            >
              <Flex>
                <Text className="brand-radio-numOfAgenciesforCampaigns-text ff-manrope">
                  {campaignEmployees?.question || campaignEmployees?.title}
                </Text>
              </Flex>
              <Flex>
                <Radio.Group className="brand-radio-numOfAgenciesforCampaigns-row">
                  {campaignEmployees?.options.map((agency) => (
                    <Flex
                      key={agency}
                      className="brand-radio-numOfAgenciesforCampaigns-item"
                    >
                      <Controller
                        name="agency"
                        control={control}
                        render={({ field }) => (
                          <Radio
                            {...field}
                            onChange={(e) => {
                              setValue(
                                "agency.questionId",
                                campaignEmployees?.id,
                                { shouldValidate: true }
                              );
                              setValue(
                                "agency.srNo",
                                campaignEmployees?.sr_no,
                                { shouldValidate: true }
                              );
                              setValue("agency.answer", e.target.value, {
                                shouldValidate: true,
                              });
                              trigger("agency");
                            }}
                            className="brand-radio-numOfAgenciesforCampaigns-row-cb ff-manrope"
                            value={agency}
                          >
                            {agency}
                          </Radio>
                        )}
                      />
                    </Flex>
                  ))}
                </Radio.Group>
              </Flex>
              {errors.agency && (
                <Text type="danger">{errors.agency.message}</Text>
              )}
            </Flex>
          </Flex>
        ) : (
          <Spin />
        )}
        {/* </Form> */}
      </Flex>
    </>
  );
};

export default RegistrationForm;
