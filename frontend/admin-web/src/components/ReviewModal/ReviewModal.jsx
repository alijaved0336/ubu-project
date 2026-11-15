import PropTypes from "prop-types";
import useCreateReview from "../../application-wide/api-gateway-hooks/use-create-review";

import { Flex, Form, Input, Grid,Rate, Switch } from "antd";
import { UBUModal, CustomButton } from "@src/components";
import { useGetUserQuery } from "@src/store/api/userApi";
import { isSuccess } from "@src/utils/responseHelpers";
import { showNotification } from "@src/utils/showNotification";
import { useState } from "react";

const ReviewModal = ({
  isReviewModalVisible,
  setIsReviewModalVisible,
  brand,
  influencer,
  campaign,
  sideEffect,
  prioritizeSideEffect,
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { onCreateReview } = useCreateReview();
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const { user } = useGetUserQuery(undefined, {
    selectFromResult: ({ data, isLoading, isFetching }) => ({
      user: data ?? {},
      loading: isLoading || isFetching,
    }),
  });
  const handleReviewSubmission = async (values) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
      };
      const response = await onCreateReview(payload);
      if (isSuccess(response.status)) {
        if (sideEffect && prioritizeSideEffect) {
          await sideEffect();
          setIsSubmitting(false);
          setIsReviewModalVisible(!isReviewModalVisible);
        } else {
          showNotification({
            notificationType: "success",
            message: "Review Completed",
            description: "Review has been completed",
          });
          setIsReviewModalVisible(!isReviewModalVisible);
          await sideEffect();
        }
        form.resetFields();
      } else {
        setIsSubmitting(false);
        showNotification({
          notificationType: "error",
          message: "Something went wrong",
          description: "Review submission failed",
        });
      }
    } catch (error) {
      setIsSubmitting(false);
      showNotification({
        notificationType: "error",
        message: "Something went wrong",
        description: "Review submission failed",
      });
      console.error("Error submitting form:", error);
    }
  };

  return (
    <UBUModal
      title="Review"
      open={isReviewModalVisible}
      onCancel={() => {
        setIsReviewModalVisible(!isReviewModalVisible);
        form.resetFields();
      }}
      width={screens.xs?"80%":screens.sm?"50%":"30%"}
      height="60%"
      footer={[
        <CustomButton
          onClick={() => form.submit()}
          loading={isSubmitting}
          variant={"black"}
          key={"submit"}
        >
          Submit
        </CustomButton>,
      ]}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleReviewSubmission}
        initialValues={{
          reviewer_id: user?.is_brand ? brand?.id : influencer?.id,
          reviewer_type: user?.is_brand ? "brand" : "influencer",
          reviewable_id: !user?.is_brand ? brand?.id : influencer?.id,
          reviewable_type: !user?.is_brand ? "brand" : "influencer",
          is_anonymous: false,
          campaign_id: campaign?.id,
        }}
      >
        <Flex style={{display:"flex", flexDirection:"column"}}>
        <Form.Item
            label="Rating"
            name="rating"
            rules={[{ required: true, message: "Please provide a rating!" }]}
          >
            <Rate allowHalf />
          </Form.Item>

          <Form.Item label="Anonymous Review" name="is_anonymous">
            <Switch />
          </Form.Item>
        </Flex>

        <Form.Item label="Comment" name="comment">
          <Input.TextArea rows={4} placeholder="Enter your comment" />
        </Form.Item>

        <Form.Item name="reviewer_id" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="reviewer_type" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="reviewable_id" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="reviewable_type" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="campaign_id" hidden>
          <Input />
        </Form.Item>
      </Form>
    </UBUModal>
  );
};

ReviewModal.propTypes = {
  isReviewModalVisible: PropTypes.bool,
  setIsReviewModalVisible: PropTypes.func,
  brand: PropTypes.object,
  influencer: PropTypes.object,
  campaign: PropTypes.object,
  sideEffect: PropTypes.func,
  prioritizeSideEffect: PropTypes.bool,
};

export default ReviewModal;
