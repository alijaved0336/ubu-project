import LandingPageLayout from "../layouts/LandingPageLayout";
import FooterLayout from "../layouts/FooterLayout";
import { Button, Flex, Form, Input, message, Typography } from "antd";
import "./contact-us.less";
import GenericLayout from "../layouts/GenericLayout";
import TextArea from "antd/es/input/TextArea";
import getContactUsSchema from "../../schemas/contactUsSchema";
import { useTranslation } from "react-i18next";
import { useCallback, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSubmitContactUsForm } from "../../application-wide/api-gateway-hooks";
import Loader from "../../components/Loader";
import { showNotification } from "../../utils/showNotification";
import { Container, CustomButton } from "@src/components";
import { CHECK_EMAIL_IN_SPAM_MESSAGE, EMAIL_SENT_MESSAGE } from "@src/utils/constant";

const ContactUs = () => {
  const { Text } = Typography;
  const { t } = useTranslation();

  const schema = useMemo(() => getContactUsSchema(t), [t]);
  const { loading, value, error, onSubmitContactUsForm } =
    useSubmitContactUsForm();
  const {
    handleSubmit,
    control,
    formState: { errors },
    register,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = useCallback(async (values) => {
    const res = await onSubmitContactUsForm(values);
    if (res.status == 200) {
      reset();
      showNotification({
        notificationType: "success",
        message: "Form Submitted",
        duration: 10,
        description: `Thanks for reaching out! ${EMAIL_SENT_MESSAGE} ${CHECK_EMAIL_IN_SPAM_MESSAGE}`,
      });
    } else {
      showNotification({
        notificationType: "error",
        message: res.response.data?.error,
        description: res.response.data?.message,
      });
    }
  }, []);
  return (
    <LandingPageLayout>
      {loading && <Loader />}
      <FooterLayout>
        <Flex vertical className="parent-contact-form">
          <GenericLayout heading="Contact Us">
            <Flex
              justify="center"
              align="center"
              className="parent-contact-form-1"
            >
              <Form className="contact-form" onFinish={handleSubmit(onSubmit)}>
                <h1 className="form-heading ff-manrope">
                  Get in touch with us! Whether you need support, have feedback,
                  or just want to say hello, our team is ready to assist you.
                </h1>
                <Flex className="contact-form-div" gap="large">
                  <Flex className="flex-w-100" vertical>
                    <Controller
                      name="first_name"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          className="contact-input"
                          placeholder="First Name"
                        />
                      )}
                    />
                    {errors.first_name && (
                      <Text type="danger">{errors.first_name.message}</Text>
                    )}
                  </Flex>
                  <Flex className="flex-w-100" vertical>
                    <Controller
                      name="last_name"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          className="contact-input"
                          placeholder="Last Name"
                        />
                      )}
                    />
                    {errors.last_name && (
                      <Text type="danger">{errors.last_name.message}</Text>
                    )}
                  </Flex>
                </Flex>
                <Flex vertical className="flex-w-100">
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        className="contact-input"
                        placeholder="Email"
                      />
                    )}
                  />
                  {errors.email && (
                    <Text type="danger">{errors.email.message}</Text>
                  )}
                </Flex>
                <Flex vertical className="flex-w-100">
                  <Controller
                    name="your_question"
                    control={control}
                    render={({ field }) => (
                      <TextArea
                        {...field}
                        className="contact-text-area"
                        placeholder="Your Question"
                        rows={4}
                      />
                    )}
                  />
                  {errors.your_question && (
                    <Text type="danger">{errors.your_question.message}</Text>
                  )}
                </Flex>
                <CustomButton
                  variant={"black"}
                  htmlType="submit"
                  className="contact-btn"
                >
                  Submit
                </CustomButton>
              </Form>
            </Flex>
          </GenericLayout>
        </Flex>
      </FooterLayout>
    </LandingPageLayout>
  );
};
export default ContactUs;
