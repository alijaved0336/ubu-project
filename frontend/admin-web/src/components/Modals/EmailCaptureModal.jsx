import React, { useCallback, useMemo, useState } from "react";
import { Modal, Button, Input, Form, Typography, Flex } from "antd";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import getEmailCaptureSchema from "../../schemas/EmailCaptureSchema";
import { useTranslation } from "react-i18next";
import exclamation from "../../assets/exclamation.png";
import Xicon from "../../assets/xicon.png";
import Emailicon from "../../assets/emailicon.png";
import { useCaptureEmail } from "../../application-wide/api-gateway-hooks";
import { showNotification } from "../../utils/showNotification";
import "./EmailCaptureModal.less";
import Loader from "../Loader";
import {
  CHECK_EMAIL_IN_SPAM_MESSAGE,
  EMAIL_SENT_MESSAGE,
} from "@src/utils/constant";
import { isSuccess } from "@src/utils/responseHelpers";

const { Text } = Typography;

const EmailCaptureModal = ({ isOpen, setIsOpen }) => {
  const { t } = useTranslation();
  const schema = useMemo(() => getEmailCaptureSchema(t), [t]);
  const { loading, onCaptureEmail } = useCaptureEmail();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = useCallback(async (values) => {
    values["page"] = "ios";
    const res = await onCaptureEmail(values);
    if (isSuccess(res.status)) {
      showNotification({
        notificationType: "success",
        message: "Email Captured",
        description: `We will get back to you! ${EMAIL_SENT_MESSAGE} ${CHECK_EMAIL_IN_SPAM_MESSAGE}`,
      });
      reset();
      handleCloseModal();
    } else {
      showNotification({
        notificationType: "error",
        message: res.response.data?.error,
        description: res.response.data?.message,
      });
    }
  }, []);

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <Modal
        title={
          <Flex
            className="w-modal-parent"
            justify="space-between"
            align="center"
          >
            <Flex
              className="w-modal-header-1"
              justify="center"
              align="center"
              gap={24}
            >
              <img
                className="w-modal-header-img"
                src={exclamation}
                alt="exclamation"
              />
              <Text>Important Notice!</Text>
            </Flex>
            <Flex className="w-modal-header-2">
              <Button
                className="modal-btn"
                icon={<img src={Xicon} alt="close" />}
                onClick={handleCloseModal}
              />
            </Flex>
          </Flex>
        }
        open={isOpen}
        footer={null}
        centered
        width="100%"
        zIndex={400}
        closable={false}
        className="EmailCaptureModal"
        // onCancel={handleCloseModal}
      >
        {loading && <Loader />}
        <Flex vertical gap={"1.5rem"}>
          <Text className="main-text">
            As we are under development please provide us your email as our
            first accounts member and get the experience world most unique way
            of shopping.
          </Text>
          <Form onFinish={handleSubmit(onSubmit)}>
            <Flex
              className="w-modal-footer-parent"
              justify="space-between"
              align="center"
              gap={24}
            >
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    {...field}
                    className="w-modal-footer-input"
                    prefix={<img src={Emailicon} alt="email-icon" />}
                    placeholder="Email"
                  />
                )}
              />
              <Button htmlType="submit" className="w-modal-footer-btn">
                Let&apos;s Go
              </Button>
            </Flex>
            {errors.email && (
              <Text type="danger" style={{ marginLeft: "10px" }}>
                {errors.email.message}
              </Text>
            )}
          </Form>
        </Flex>
      </Modal>
    </div>
  );
};

export default EmailCaptureModal;
