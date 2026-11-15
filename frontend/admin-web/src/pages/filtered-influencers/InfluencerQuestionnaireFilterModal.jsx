import React, {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Heading } from "@src/components/Common/Typography";
import { Button } from "@src/components/Common/Widgets";
import CustomModal from "@src/components/Modals/CustomModal";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { Form, notification, Spin } from "antd";
import { useFilteredInfluencers } from "./Providers/FilteredInfluencersProvider";
import { useUpdateSegmentFiltersMutation } from "@src/store/api/segmentsApi";
import { useParams } from "react-router-dom";
import { FALLBACK_ERROR_MESSAGE } from "@src/utils/constant";
// import SegmentFilterForm from "../segments/SegmentFilterForm";
import { useInfluencerQuestionnaire } from "./Providers/InfluencerQuestionnaireProvider";
import SegmentQuestionnaireFilter from "@src/components/SegmentQuestionnaireFilter";
import { getDefaultFilterState } from "@src/components/SegmentQuestionnaireFilter/helpers";

import useQuestionnaireHelpers from "@src/hooks/useQuestionnaireHelpers";
import { isEmpty } from "lodash";
const SegmentFilterForm = lazy(() => import("../segments/SegmentFilterForm"));

const InfluencerQuestionnaireFilterModal = ({ isOpen, onClose }) => {
  const [inputValues, setInputValues] = useState({});
  const [getLocId, setGeoLocId] = useState(0);

  const [otherStates, setOtherStates] = useState({
    selectedGender: 0,
  });

  const { id } = useParams(); // Gets the segment ID from the URL

  const [updateSegmentFilters, { isLoading: isUpdatingSegmentFilters }] =
    useUpdateSegmentFiltersMutation();

  const { onResetFilters, segmentFilter, onUpdateSegmentFilter } =
    useFilteredInfluencers();

  const { questionnaireData } = useInfluencerQuestionnaire();

  const {
    questionnaire,
    appliedFilters,
    existingOtherFields,
    getMappedQuestionnaireData,
    defaultInputOptionsValue,
    defaultOtherStates,
  } = useQuestionnaireHelpers(questionnaireData, segmentFilter);

  const form = useForm({
    values: { ...getDefaultFilterState(questionnaire), ...appliedFilters },
    mode: "onChange",
  });

  const { handleSubmit, reset, watch } = form;
  const formState = watch();

  const isFilterEmpty = useMemo(() => {
    return Object.values(formState)?.every((answers) => isEmpty(answers));
  }, [formState]);

  const handleChangeOtherStates = useCallback((name, value) => {
    setOtherStates((prevStates) => ({ ...prevStates, [name]: value }));
  }, []);

  const onSubmit = async (data) => {
    const mappedData = getMappedQuestionnaireData(data);

    const finalPayload = Object.keys(mappedData)?.reduce((acc, key) => {
      const foundQuestion = questionnaire?.find(
        (question) => question?.sr_no === +key
      );

      if (foundQuestion && !isEmpty(mappedData[key])) {
        acc[foundQuestion?.id] = mappedData[key];
      }

      return acc;
    }, {});

    const payload = {
      savedFilter: finalPayload,
    };

    try {
      const response = await updateSegmentFilters({
        id,
        data: payload,
      }).unwrap();

      const updatedFilter = response?.data?.savedFilter;

      onUpdateSegmentFilter && onUpdateSegmentFilter(updatedFilter);
      onResetFilters && onResetFilters();
    } catch (error) {
      notification.error({
        message: "Error",
        description: error?.message || FALLBACK_ERROR_MESSAGE,
      });
    } finally {
      onClose();
    }
  };

  const handleResetFilters = () => {
    reset({
      ...getDefaultFilterState(questionnaire),
      ...defaultInputOptionsValue,
    });

    setOtherStates((prev) => ({ ...prev, ...defaultOtherStates }));

    const filterButton = document.getElementById("btn-filter");
    if (filterButton) filterButton.click();
  };

  useEffect(() => {
    if (!isEmpty(existingOtherFields)) {
      const selectedOtherStates = Object.keys(existingOtherFields)?.reduce(
        (acc, curr) => {
          acc[curr] = true;
          return acc;
        },
        {}
      );

      setOtherStates((prev) => ({ ...prev, ...selectedOtherStates }));
    }
  }, [existingOtherFields]);

  return (
    <CustomModal
      title={
        <Heading className="tw-font-manrope tw-font-bold" level={3}>
          Filters
        </Heading>
      }
      width="1280px"
      isOpen={isOpen}
      className="!tw-h-auto"
      onCancel={onClose}
      centered
      footer={null}
    >
      <Form onFinish={handleSubmit(onSubmit)}>
        <div className="tw-overflow-auto tw-h-[70vh]">
          <SegmentQuestionnaireFilter
            form={form}
            questionnaireData={questionnaireData}
            otherStates={otherStates}
            onChangeOtherStates={handleChangeOtherStates}
          />
        </div>
        <div className="footerDiv">
          <Button
            key="cancel"
            htmlType="button"
            variant="outlined"
            disabled={isFilterEmpty || isUpdatingSegmentFilters}
            onClick={handleResetFilters}
          >
            Clear Filters
          </Button>
          <Button
            loading={isUpdatingSegmentFilters}
            disabled={isUpdatingSegmentFilters}
            htmlType="submit"
            id="btn-filter"
          >
            Apply Filters
          </Button>
        </div>
      </Form>
    </CustomModal>
  );
};

InfluencerQuestionnaireFilterModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default InfluencerQuestionnaireFilterModal;
