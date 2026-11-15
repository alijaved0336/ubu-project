import { zodResolver } from "@hookform/resolvers/zod";
import { UBUTextArea } from "@src/components";
import { Heading } from "@src/components/Common/Typography";
import { Button } from "@src/components/Common/Widgets";
import CustomModal from "@src/components/Modals/CustomModal";

import {
  useCreateDisputeMutation,
  useUpdateDisputeMutation,
} from "@src/store/api/disputeApi";
import { FALLBACK_ERROR_MESSAGE } from "@src/utils/constant";
import { Checkbox, Form, notification } from "antd";
import PropTypes from "prop-types";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";

const validationSchema = z.object({
  concern: z
    .string()
    .trim()
    .min(1, "Please enter your concern here")
    .min(10, "The concern must be at least 10 characters long."),
  is_refund_requested: z.boolean().optional(),
});
const CreateDisputeModal = ({
  isOpen,
  onCancel,
  onConfirm,
  campaignId,
  campaignDisputes,
}) => {
  const { user } = useSelector((state) => state.auth || {});

  const dispute = campaignDisputes?.[0];
  const isResolvedDispute = dispute?.status === "resolved";

  const isRaisedByBrand = dispute?.raised_by?.is_brand;
  const isRaisedByInfluencer = dispute?.raised_by?.is_influencer;

  const isUpdating =
    (isRaisedByBrand || isRaisedByInfluencer) && !isResolvedDispute;

  const [createDispute, { isLoading: isCreatingDispute }] =
    useCreateDisputeMutation();
  const [updateDispute, { isLoading: isUpdatingDispute }] =
    useUpdateDisputeMutation();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(validationSchema),
    defaultValues: {
      concern: "",
      is_refund_requested: false,
    },
  });

  const onSubmit = async (data) => {
    const payload = {};

    if (!isUpdating) {
      payload.campaign_id = +campaignId;
    }

    if (user?.type === "brand") {
      payload.brand_concerns = data?.concern?.trim();
      payload.is_refund_requested = data.is_refund_requested;
    } else {
      payload.influencer_concerns = data?.concern?.trim();
    }

    if (isUpdating) {
      payload.campaignDisputeId = dispute?.id;
    }

    try {
      await (isUpdating
        ? updateDispute(payload).unwrap()
        : createDispute(payload).unwrap());

      notification.success({
        message: "Success",
        description: `The Dispute has been ${
          isUpdating ? "updated" : "created"
        } successfully.`,
      });
      onConfirm && onConfirm();
    } catch (error) {
      notification.error({
        message: "Error",
        description: error?.message || FALLBACK_ERROR_MESSAGE,
      });
      console.log(error?.message);
    }
  };

  return (
    <CustomModal
      title={
        <Heading className="tw-font-manrope tw-font-bold" level={2}>
          {isUpdating ? "Update" : "Create"} Dispute
        </Heading>
      }
      width="536px"
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
            loading={isCreatingDispute || isUpdatingDispute}
            disabled={isCreatingDispute || isUpdatingDispute}
          >
            {isUpdating ? "Update" : "Create"}
          </Button>
        </div>
      }
    >
      <div className="tw-space-y-6 tw-font-manrope">
        <Form layout="vertical">
          <Form.Item
            label="Your Concern"
            validateStatus={errors.concern ? "error" : ""}
            help={errors.concern?.message || ""}
          >
            <Controller
              name="concern"
              control={control}
              render={({ field }) => (
                <UBUTextArea
                  {...field}
                  placeholder="Enter your Concerns"
                  rows="10"
                  status={errors.concern ? "error" : ""}
                />
              )}
            />
          </Form.Item>
          {user?.type === "brand" && (
            <Form.Item>
              <Controller
                name="is_refund_requested"
                control={control}
                render={({ field }) => (
                  <Checkbox {...field}>Request a Refund</Checkbox>
                )}
              />
            </Form.Item>
          )}
        </Form>
      </div>
    </CustomModal>
  );
};

CreateDisputeModal.propTypes = {
  campaignId: PropTypes.oneOfType[(PropTypes.string, PropTypes.number)],
  isOpen: PropTypes.bool,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  campaignDisputes: PropTypes.object,
};

export default CreateDisputeModal;
