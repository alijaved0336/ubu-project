import { useEffect, useState } from "react";
import { Form } from "antd";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../application-wide/axios/axios-instance";
import CampaignForm from "../../components/Campaign/CampaignForm";
import { CustomButton, UBUModal } from "@src/components";
import { useDispatch, useSelector } from "react-redux";
import { resetCampaignForm } from "@src/store/features/campaignFormSlice";

const SendDocumentModal = ({
  influencer,
  isModalVisible,
  setIsModalVisible,
  selectedInfId,
  selectedSegmentId,
}) => {
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formData = useSelector((state) => state.campaignForm || {});

  const onFinish = async (values) => {
    setLoading(true);

    const payload = {
      influencerId: selectedInfId,
      description: values.description,
      hashtags: values.hashtags,
      campaignName:values.campaignName,
      numberOfDeliverables: values.deliverables,
      campaignAcceptanceDeadline: values.campaignAcceptanceDeadline
        ? values.campaignAcceptanceDeadline.format("YYYY-MM-DD")
        : null,
      publicationDates: values.publicationDates
        ? values.publicationDates.format("YYYY-MM-DD")
        : null,
      totalCompensation: values.totalCompensation,
      brandGuidelines: values.brandGuidelines || undefined,
      additionalRequirements: values.additionalRequirements || undefined,
      specialConditions: values.specialConditions || undefined,
      revisions:
        values.numberOfRevisions && values.turnAroundTime
          ? {
              number: values.numberOfRevisions,
              turnaroundTime: Number(values.turnAroundTime),
            }
          : undefined, // Only add revisions if both values exist
      productId: values.selectedProduct
        ? Number(values.selectedProduct?.id)
        : null,
    };

    try {
      const response = await axiosInstance.post(
        "/campaign/create-document",
        payload,
        {}
      );

      if (response.status === 201 && response.data.documentUrl) {
        navigate(
          `/dashboard/segments/${selectedSegmentId}/influencers/${selectedInfId}/review-document`,
          {
            state: {
              s3Link: response.data.documentUrl,
              payload: payload,
              influencer: influencer,
              campaignId: null,
              advertisemntUrl: values.advertisemntUrl,
              from: location.pathname,
            },
          }
        );
      } else {
        console.error("S3 link not found in response.");
      }

      setIsModalVisible(false);
    } catch (error) {
      console.error("Error creating document:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAndResetCampaignFormModal = () => {
    dispatch(resetCampaignForm()); // Reset Redux state
    form.resetFields(); // Reset AntD form fields
    setIsModalVisible(false); // Hide modal
  };

  useEffect(() => {
    if (isModalVisible) {
      form.setFieldsValue({ ...formData });
    }
  }, [isModalVisible, formData, form]);

  return (
    <UBUModal
      title="Send Document"
      open={isModalVisible}
      onCancel={handleCloseAndResetCampaignFormModal}
      onOk={() => form.submit()}
      okText="Review Document"
      maskClosable={false}
      width="70%"
      footer={[
        <CustomButton
          onClick={() => form.submit()}
          loading={loading}
          variant={"black"}
          key={"submit"}
        >
          Submit
        </CustomButton>,
      ]}
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <CampaignForm
          form={form}
          hashtagData={[]}
          productData={formData?.selectedProduct}
        />
      </Form>
    </UBUModal>
  );
};

export default SendDocumentModal;
