import { zodResolver } from "@hookform/resolvers/zod";
import WarningIconWithShadow from "@src/assets/icons/WarningIconWithShadow";
import { UBUTextArea } from "@src/components";
import { Heading } from "@src/components/Common/Typography";
import { Button } from "@src/components/Common/Widgets";
import CustomModal from "@src/components/Modals/CustomModal";
import { useProcessRefundMutation } from "@src/store/api/campaignPaymentApi";
import { FALLBACK_ERROR_MESSAGE } from "@src/utils/constant";
import { Form, message } from "antd";
import PropTypes from "prop-types";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const validationSchema = z.object({
  reason: z
    .string()
    .min(1, "Please enter a reason here")
    .min(10, "The reason must be at least 10 characters long."),
});

const ProcessRefundModal = ({ isOpen, onCancel, onConfirm, campaignId }) => {
  const [processRefund, { isLoading }] = useProcessRefundMutation();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(validationSchema),
    defaultValues: {
      reason: "",
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      campaign_id: campaignId,
      reason: data?.reason || "",
    };

    try {
      await processRefund(payload).unwrap();
      onConfirm && onConfirm("The refund has been successfully processed.");
    } catch (error) {
      message.error(error?.message || FALLBACK_ERROR_MESSAGE);
    }
  };

  console.log({ campaignId });
  return (
    <CustomModal
      title={null}
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
            loading={isLoading}
            disabled={isLoading}
          >
            Proceed
          </Button>
        </div>
      }
    >
      <div className="tw-space-y-6 tw-font-manrope">
        <div className="tw-space-y-6 tw-text-center">
          <WarningIconWithShadow
            width="54"
            height="54"
            className="tw-mx-auto"
          />
          <Heading level={5} className="tw-font-bold">
            Are you sure you want to process this refund?
          </Heading>
        </div>

        <Form layout="vertical">
          <Form.Item
            label="Reason"
            validateStatus={errors.reason ? "error" : ""}
            help={errors.reason?.message || ""}
          >
            <Controller
              name="reason"
              control={control}
              render={({ field }) => (
                <UBUTextArea
                  {...field}
                  placeholder="Enter your reason"
                  rows="10"
                  status={errors.reason ? "error" : ""}
                />
              )}
            />
          </Form.Item>
        </Form>
      </div>
    </CustomModal>
  );
};

ProcessRefundModal.propTypes = {
  campaignId: PropTypes.oneOfType[(PropTypes.string, PropTypes.number)],
  isOpen: PropTypes.bool,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
};

export default ProcessRefundModal;
