import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { UBUTextArea } from "@src/components";
import { Heading } from "@src/components/Common/Typography";
import { Button } from "@src/components/Common/Widgets";
import CustomModal from "@src/components/Modals/CustomModal";
import { useResolveDisputeMutation } from "@src/store/api/disputeApi";
import { FALLBACK_ERROR_MESSAGE } from "@src/utils/constant";
import { Form, notification, Radio } from "antd";
import PropTypes from "prop-types";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const validationSchema = z.object({
  remarks: z
    .string()
    .trim()
    .min(1, "Please enter your remarks here")
    .min(10, "The remarks must be at least 10 characters long."),
  resolutionAction: z
    .string({ required_error: "Please select a resolution action." }) // Ensure required validation message
    .min(1, "Please select a resolution action."),
});

const DisputeResolveModal = ({ isOpen, onCancel, onConfirm, dispute }) => {
  const [resolveDispute, { isLoading: isResolving }] =
    useResolveDisputeMutation();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(validationSchema),
    defaultValues: {
      remarks: "",
      resolutionAction: "",
    },
  });

  const onSubmit = async (data) => {
    data.remarks = data?.remarks?.trim();

    const payload = {
      ...data,
      campaignDisputeId: dispute?.id,
    };

    console.log({ payload });

    try {
      const response = await resolveDispute(payload).unwrap();

      notification.success({
        message: "Success",
        description: response?.data?.message,
      });
      onConfirm && onConfirm();
    } catch (error) {
      notification.error({
        message: "Error",
        description: error?.message || FALLBACK_ERROR_MESSAGE,
      });
    }
  };

  return (
    <CustomModal
      title={
        <Heading className="tw-font-manrope tw-font-bold" level={2}>
          Resolve Dispute
        </Heading>
      }
      width="680px"
      isOpen={isOpen}
      className="!tw-h-auto"
      onCancel={onCancel}
      centered
      bodyWrapperClassName="tw-p-4"
      footer={
        <div className="tw-flex tw-items-center tw-gap-3 tw-justify-center">
          <Button
            className="tw-w-full"
            type="secondary"
            variant="outlined"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            className="tw-w-full"
            onClick={handleSubmit(onSubmit)}
            loading={isResolving}
            disabled={isResolving}
          >
            Resolve
          </Button>
        </div>
      }
    >
      <div className="tw-space-y-6 tw-font-manrope">
        <Form layout="vertical">
          <Form.Item
            label="Your Remarks"
            validateStatus={errors.remarks ? "error" : ""}
            help={errors.remarks?.message || ""}
          >
            <Controller
              name="remarks"
              control={control}
              render={({ field }) => (
                <UBUTextArea
                  {...field}
                  placeholder="Enter your Remarks"
                  rows="10"
                  status={errors.remarks ? "error" : ""}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Resolution Action"
            validateStatus={errors.resolutionAction ? "error" : ""}
            help={errors.resolutionAction?.message || ""}
          >
            <Controller
              name="resolutionAction"
              control={control}
              render={({ field }) => (
                <Radio.Group
                  {...field}
                  status={errors.resolutionAction ? "error" : ""}
                  className="tw-font-manrope tw-flex tw-justify-between tw-items-center tw-font-semibold"
                >
                  <Radio value="refund_to_brand">Refund to Brand</Radio>
                  <Radio value="release_funds_to_influencer">
                    Release Funds to Influencer
                  </Radio>
                  <Radio value="restart_campaign">Restart Campaign</Radio>
                </Radio.Group>
              )}
            />
          </Form.Item>
        </Form>
      </div>
    </CustomModal>
  );
};

DisputeResolveModal.propTypes = {
  isOpen: PropTypes.bool,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  campaignId: PropTypes.oneOfType[(PropTypes.string, PropTypes.number)],
  dispute: PropTypes.object,
};

export default DisputeResolveModal;
