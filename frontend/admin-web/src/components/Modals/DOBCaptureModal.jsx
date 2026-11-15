import React, { useState } from "react";
import { Modal, Form, message } from "antd";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dayjs from "dayjs";
import { CustomButton, Text, UBUDatePicker } from "@src/components";
import useAuthUser from "@src/application-wide/api-gateway-hooks/use-auth-user";
import "./DOBCaptureModal.less";
import PropTypes from "prop-types";

const dobSchema = z.object({
  dob: z
    .string()
    .min(1, "Date of birth is required")
    .refine((date) => {
      if (!date) return false;
      const selectedDate = new Date(date);
      const today = new Date();
      return selectedDate <= today;
    }, "Date of birth cannot be in the future"),
});

const DOBCaptureModal = ({ isOpen, setIsOpen, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { onUpdateAuthUserProfile } = useAuthUser();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(dobSchema),
    defaultValues: {
      dob: "",
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await onUpdateAuthUserProfile({
        dob: values.dob,
      });

      if ([200, 201].includes(response.status)) {
        message.success("Date of birth updated successfully!");
        setIsOpen(false);
        if (onSuccess) {
          onSuccess(response.data);
        }
      }
    } catch (error) {
      console.error("Error updating DOB:", error);
      message.error("Failed to update date of birth. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    message.warning("Please enter your date of birth to continue.");
  };

  return (
    <Modal
      title={null}
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      closable={false}
      maskClosable={false}
      className="dob-capture-modal"
      centered
    >
      <div className="dob-modal-content">
        <div className="dob-modal-header">
          <Text className="fs-20 fw-600 text-center">
            Complete Your Profile
          </Text>
          <Text className="fs-14 fw-400 text-greyscale-500 text-center">
            Please enter your date of birth to continue
          </Text>
        </div>

        <Form
          layout="vertical"
          onFinish={handleSubmit(onSubmit)}
          className="dob-form"
        >
          <Form.Item
            label="Date of Birth"
            validateStatus={errors.dob ? "error" : ""}
            help={errors.dob?.message}
          >
            <Controller
              name="dob"
              control={control}
              render={({ field }) => (
                <UBUDatePicker
                  {...field}
                  placeholder="Select your date of birth"
                  format="YYYY-MM-DD"
                  style={{ width: "100%" }}
                  size="large"
                  disabledDate={(current) =>
                    current && current > dayjs().endOf("day")
                  }
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => {
                    const stringValue = date ? date.format("YYYY-MM-DD") : "";
                    field.onChange(stringValue);
                  }}
                />
              )}
            />
          </Form.Item>

          <div className="dob-modal-actions">
            <CustomButton
              htmlType="submit"
              variant="black"
              loading={loading}
              style={{ width: "100%" }}
            >
              Continue
            </CustomButton>
          </div>
        </Form>
      </div>
    </Modal>
  );
};
DOBCaptureModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  onSuccess: PropTypes.func, // optional callback after successful DOB submission
};
export default DOBCaptureModal;
