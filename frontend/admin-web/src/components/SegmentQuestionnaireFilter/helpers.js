export const getDefaultFilterState = (questionnaire) => {
  const defaultState = questionnaire?.reduce((acc, curr) => {
    acc[curr?.sr_no] = [];

    return acc;
  }, {});

  return defaultState;
};
