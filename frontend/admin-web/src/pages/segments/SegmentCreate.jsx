import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import "./SegmentCreate.less";
import axiosInstance from "../../application-wide/axios/axios-instance";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Grid,
  Flex,
  Typography,
  Checkbox,
  Button,
  Form,
  Radio,
  Input,
  message,
  Spin,
} from "antd";
import { Controller, useForm } from "react-hook-form";
import Loader from "../../components/Loader";
import Notification from "../../components/Notification";
import SegmentFilterForm from "./SegmentFilterForm";
import SmallLoader from "../../components/SmallLoader";
import { Skeleton } from "antd";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";
import useQuestionnaireHelpers from "@src/hooks/useQuestionnaireHelpers";
import { getDefaultFilterState } from "@src/components/SegmentQuestionnaireFilter/helpers";
import { isEmpty } from "lodash";
import SegmentQuestionnaireFilter from "@src/components/SegmentQuestionnaireFilter";
import { Heading } from "@src/components/Common/Typography";
import CustomInput from "@src/components/Input/Input";

const SegmentCreate = () => {
  const navigate = useNavigate();

  const [questionnaireData, setQuestionnaireData] = useState({});

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [segmentName, setSegmentName] = useState("");

  const [otherStates, setOtherStates] = useState({
    selectedGender: 0,
  });

  useEffect(() => {
    const fetchQuestionnaireData = async () => {
      try {
        const response = await axiosInstance.get("/questionnaire/segment");
        setQuestionnaireData(response?.data?.data);
      } catch (error) {
        console.error("Error fetching questionnaire data:", error);
        setError("Failed to load form data.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionnaireData();
  }, []);

  const { questionnaire, appliedFilters, getMappedQuestionnaireData } =
    useQuestionnaireHelpers(questionnaireData, {});

  const form = useForm({
    values: { ...getDefaultFilterState(questionnaire), ...appliedFilters },
    mode: "onChange",
  });

  const { handleSubmit } = form;

  const handleChangeOtherStates = useCallback((name, value) => {
    setOtherStates((prevStates) => ({ ...prevStates, [name]: value }));
  }, []);

  const onSubmit = async (data) => {
    if (!segmentName) {
      message.error("Segment name cannot be empty");
      // setError("Segment name cannot be empty");
      return;
    }

    const mappedData = getMappedQuestionnaireData(data);

    const savedFilter = Object.keys(mappedData)?.reduce((acc, key) => {
      const foundQuestion = questionnaire?.find(
        (question) => question?.sr_no === +key
      );

      if (foundQuestion && !isEmpty(mappedData[key])) {
        acc[foundQuestion?.id] = mappedData[key];
      }

      return acc;
    }, {});

    const formattedData = {
      name: segmentName,
      savedFilter,
    };

    try {
      setSubmitLoading(true);

      await axiosInstance.post("/segments", formattedData);
      navigate("/dashboard/segments");
    } catch (error) {
      console.error("Error adding segment:", error);
      message.error("Something went wrong. Please try again later.");
    } finally {
      setSuccess("Segment Created Successfully");
      setLoading(false);
      setSubmitLoading(false);
    }
  };

  const handleChange = (e) => {
    setSegmentName(e.target.value);
  };

  const handleBack = () => {
    navigate("/dashboard/segments");
  };

  const handleCloseNotification = () => {
    setError(null);
    setSuccess(null);
  };

  useLayoutEffect(() => {
    const content = document.getElementById("dashoard-main");

    if (content) {
      content.style.paddingTop = 0;
    }
  }, []);

  return (
    <div className="segment-create-container">
      <UBUBreadCrumb
        items={[
          { title: "Dashboard" },
          { title: <NavLink to={"/dashboard/segments"}>Segments</NavLink> },
          { title: "Create" },
        ]}
      />
      <div className="ubu-container">
        <Heading
          level={2}
          className="tw-text-center tw-w-full tw-font-vogue tw-font-normal"
        >
          Welcome to UBU Campaign Creator Search
        </Heading>

        <div className="ubu-description">
          Thank you for choosing UBU to help you find the perfect creators for
          your campaign. To ensure we provide you with the best matches, please
          answer the following questions. Each section will help refine your
          search results, allowing you to connect with creators who align with
          your brand’s values, target audience, and campaign goals.
        </div>
      </div>
      <div>
        {error && (
          <Notification
            message={error}
            type="error"
            onClose={handleCloseNotification}
          />
        )}
        <div className="segment-create-header tw-mt-5">
          <Heading level={3}>Create New Segment</Heading>
        </div>

        <Form
          id="segment-create-form"
          className="tw-mt-10"
          onFinish={handleSubmit(onSubmit)}
        >
          <div className="form-group">
            <label className="form-label black-color">Segment Name</label>
            <CustomInput
              type="text"
              name="segment_name"
              value={segmentName}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter segment name"
            />
          </div>
          <div className="segment-filter-form-padding">
            {loading ? (
              <Spin className="tw-absolute tw-top-1/2 tw-left-1/2 -tw-translate-y-1/2 tw-translate-x-1/2" />
            ) : (
              <SegmentQuestionnaireFilter
                form={form}
                questionnaireData={questionnaireData}
                otherStates={otherStates}
                useMainScroll
                onChangeOtherStates={handleChangeOtherStates}
              />
            )}
          </div>
        </Form>
      </div>
      {!loading && (
        <div className="fixed-div">
          <div className="fixed-div-1">
            <Button
              type="primary"
              className="segment-cancel-btn"
              htmlType="submit"
              onClick={handleBack}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              className="segment-submit-btn"
              htmlType="submit"
              form="segment-create-form"
              loading={submitLoading}
            >
              Submit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SegmentCreate;
