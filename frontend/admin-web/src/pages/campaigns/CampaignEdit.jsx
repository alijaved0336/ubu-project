import React, { useEffect, useState } from "react";
import { Form, Flex } from "antd";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../application-wide/axios/axios-instance";
import "./CampaignEdit.less";
import CampaignForm from "../../components/Campaign/CampaignForm";
import moment from "moment";
import Loader from "../../components/Loader";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekYear from "dayjs/plugin/weekYear";
import { CustomButton } from "@src/components";
import CampaignEditSkeleton from "@src/components/Skeletons/CampaignEditSkeleton";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";
import { CampaignStatus } from "@src/utils/constant";
import { Button } from "@src/components/Common/Widgets";
import {
  resetCampaignForm,
  setProductChoice,
  setSelectedProduct,
  setValue,
} from "@src/store/features/campaignFormSlice";
import { useDispatch } from "react-redux";
import { isEmpty } from "lodash";

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

const CampaignEdit = ({}) => {
  const location = useLocation();
  const { id } = useParams();
  // const backwardPayload = location.state;
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [influencerId, setInfluencerId] = useState(null);
  const [segmentId, setSegmentId] = useState(null);
  const [campaignId, setCampaignId] = useState(null);
  const [hashtags, setHashtags] = useState({});
  const [deliverables, setDeliverables] = useState([]);
  const [product, setProduct] = useState();
  const [status, setStatus] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isEmpty(product)) {
      dispatch(setValue(2));
      dispatch(setProductChoice(2));
      dispatch(setSelectedProduct(product));
      form.setFieldsValue({ productChoice: 2 });
      form.setFieldsValue({ selectedProduct: product });
    }
  }, [product, dispatch, form]);

  useEffect(() => {
    return () => dispatch(resetCampaignForm());
  }, [dispatch]);

  useEffect(() => {
    const fetchCampaignData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/campaign/${id}`);

        let data = response.data?.result?.exhibitDocuments?.[0];
        const backwardPayload = JSON.parse(
          sessionStorage.getItem("backwardPayload")
        );

        if (backwardPayload) {
          data = backwardPayload;
        }
        if (data) {
          data.campaignAcceptanceDeadline = dayjs(
            data?.campaignAcceptanceDeadline
          );
          data.publicationDates = dayjs(data?.publicationDates);
          data.turnAroundTime = data?.turnAroundTime?.toString();
          data["campaignName"] = response?.data?.result?.campaignName
          form.setFieldsValue(data);

          setStatus(response.data?.result?.status);

          const separatedValues =
            data?.hashtags.flatMap((item) =>
              item.split(",").map((value) => value.trim())
            ) ?? [];
          if (separatedValues) {
            setHashtags(separatedValues);
          }
          if (data.numberOfDeliverables) {
            setDeliverables(data.numberOfDeliverables);
          }
        }

        if (data.productId) {
          const apiUrl = `/products/${data.productId}`; // Replace with your API endpoint

          try {
            const response = await axiosInstance.get(apiUrl);
            setProduct(response.data.product);
          } catch (error) {
            console.error("Error fetching product data:", error);
          }
        }

        setInfluencerId(response.data?.result?.influencerId);
        setSegmentId(response.data?.result?.segmentId);
        setCampaignId(response.data?.result?.id);
      } catch (error) {
        console.error("Error fetching segment data:", error);
      } finally {
        setLoading(false);
      }
    };

    let isMounted = true;

    if (isMounted) {
      fetchCampaignData();
    }
    return () => {
      isMounted = false;
    };
  }, [form]);

  const onFinish = async (values) => {
    setButtonLoading(true);
    const payload = {
      influencerId: influencerId,
      description: values.description,
      hashtags: values.hashtags,
      numberOfDeliverables: values.deliverables,
      campaignName:values.campaignName,
      campaignAcceptanceDeadline:
        values?.campaignAcceptanceDeadline?.format("YYYY-MM-DD"),
      publicationDates: values?.publicationDates?.format("YYYY-MM-DD"),
      totalCompensation: parseFloat(values?.totalCompensation),
      brandGuidelines: values?.brandGuidelines || undefined,
      additionalRequirements: values.additionalRequirements || undefined,
      specialConditions: values.specialConditions || undefined,
      revisions:
        values.numberOfRevisions && values.turnAroundTime
          ? {
              number: values.numberOfRevisions,
              turnaroundTime: Number(values.turnAroundTime),
            }
          : undefined, // Only add revisions if both values exist
      productId: Number(values.selectedProduct.id),
    };

    try {
      const response = await axiosInstance.post(
        "/campaign/create-document",
        payload,
        {}
      );

      if (response.status === 201 && response.data.documentUrl) {
        navigate(
          `/dashboard/segments/${segmentId}/influencers/${influencerId}/review-document`,
          {
            state: {
              advertisemntUrl: values.advertisemntUrl,
              s3Link: response.data.documentUrl,
              payload: payload,
              campaignId: campaignId,
              status,
            },
          }
        );
      } else {
        console.error("S3 link not found in response.");
      }
    } catch (error) {
      console.error("Error creating document:", error);
    } finally {
      setButtonLoading(false);
    }
  };

  const handleBack = () => {
    sessionStorage.removeItem("backwardPayload");
    navigate(-1);
  };

  return (
    <div className="campaign-edit">
      <UBUBreadCrumb
        items={[
          { title: "Dashboard" },
          {
            title: <NavLink to={"/dashboard/campaigns"}>Campaigns</NavLink>,
          },
          { title: "Edit" },
        ]}
      />
      <Flex className="tw-justify-end tw-mb-4">
        <CustomButton variant={"light"} onClick={() => handleBack()}>
          Back
        </CustomButton>
      </Flex>
      {loading ? (
        <CampaignEditSkeleton />
      ) : (
        <>
          <Form layout="vertical" form={form} onFinish={onFinish}>
            <CampaignForm
              form={form}
              status={status}
              hashtagData={hashtags}
              deliverablesData={deliverables}
              productData={product}
            />
          </Form>
          <div className="footerDiv">
            <Button
              key="submit"
              type="primary"
              loading={buttonLoading}
              onClick={() => {
                if (status === CampaignStatus.PENDING) {
                  form.submit();
                }
              }}
              disabled={status !== CampaignStatus.PENDING}
            >
              Review Document
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CampaignEdit;
