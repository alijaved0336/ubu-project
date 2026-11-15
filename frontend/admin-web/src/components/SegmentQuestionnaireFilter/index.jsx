import PropTypes from "prop-types";
import React, { useCallback, useMemo, useState } from "react";
import Question from "./Question";
import { Virtuoso } from "react-virtuoso";
import { Heading } from "../Common/Typography";
import useScrollableElement from "@src/hooks/useScrollableElement";

const SegmentQuestionnaireFilter = ({
  form,
  useMainScroll,
  questionnaireData,
  otherStates,
  onChangeOtherStates,
}) => {
  const { scrollContainer } = useScrollableElement();

  const { control, setValue } = form;

  const List = useMemo(() => {
    const List = React.forwardRef((props, ref) => (
      <div ref={ref} {...props} className="tw-flex tw-flex-col tw-gap-4" />
    ));

    List.displayName = "List";

    return List;
  }, []);

  const { questionnaire, groupCounts, groups } = useMemo(() => {
    const questionnaire = Object.values(questionnaireData)?.flatMap(
      (category) =>
        category?.map((question, index) => ({
          ...question,
          type: index === 0 ? "category" : "",
        }))
    );

    const groups = Object.keys(questionnaireData)?.map(
      (key) => questionnaireData[key][0]
    );

    const groupCounts = Object.keys(questionnaireData)?.map(
      (group) => questionnaireData[group]?.length
    );

    return { questionnaire, groups, groupCounts };
  }, [questionnaireData]);

  return (
    <Virtuoso
      overscan={500}
      style={{ height: "100%" }}
      customScrollParent={useMainScroll ? scrollContainer : undefined}
      groupCounts={groupCounts}
      groupContent={(index) => {
        return (
          <div className="tw-space-y-4 tw-bg-white tw-border-white tw-border-2 ">
            <Heading className="tw-font-extrabold" level={4}>
              {groups[index]?.question_category}
            </Heading>
            <Heading className="tw-font-bold" level={5}>
              {groups[index]?.question_category_description &&
                groups[index]?.question_category_description}
            </Heading>
          </div>
        );
      }}
      totalCount={questionnaire?.length}
      components={{
        List,
      }}
      itemContent={(index) => (
        <Question
          key={questionnaire[index]?.sr_no}
          control={control}
          question={questionnaire[index]}
          setValue={setValue}
          otherStates={otherStates}
          onChangeOtherStates={onChangeOtherStates}
        />
      )}
    />
  );
};

SegmentQuestionnaireFilter.propTypes = {
  questionnaireData: PropTypes.object,
  form: PropTypes.object,
  useMainScroll: PropTypes.bool,
  otherStates: PropTypes.object,
  onChangeOtherStates: PropTypes.func,
};
export default SegmentQuestionnaireFilter;
