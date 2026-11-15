import { UserType } from 'aws-sdk/clients/workdocs';

export const convertSecondsToReadableFormat = (seconds: number) => {
  const pluralize = (value: number, singular: string, plural: string) => (value <= 1 ? `${value} ${singular}` : `${value} ${plural}`);

  if (seconds === 0) {
    return null;
  }

  if (seconds < 60) {
    return pluralize(Math.round(seconds), 'Second', 'Seconds');
  } else if (seconds >= 60 && seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);

    return `${pluralize(minutes, 'Minute', 'Minutes')} ${pluralize(remainingSeconds, 'Second', 'Seconds')}`;
  } else if (seconds >= 3600 && seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    const remainingMinutes = Math.floor((seconds % 3600) / 60);

    return `${pluralize(hours, 'Hour', 'Hours')} ${pluralize(remainingMinutes, 'Minute', 'Minutes')}`;
  } else {
    const days = Math.floor(seconds / 86400);
    const remainingHours = Math.floor((seconds % 86400) / 3600);

    return `${pluralize(days, 'Day', 'Days')} ${pluralize(remainingHours, 'Hour', 'Hours')}`;
  }
};

export const getSelectedOptionsBySrNo = (userAnswers: any[], srNo: number, userType: UserType) => {
  const selectedOptions = userAnswers
    .filter((answer) => answer.question.sr_no === srNo && answer.question.user_type == userType)
    .flatMap((answer) => answer.selected_options);

  return selectedOptions.length > 0 ? selectedOptions : [];
};
export const extractCleanAmazonUrl = (input: string): string => {
  const sanitize = (raw: string): string => {
    const httpIndex = raw.indexOf('http');
    if (httpIndex === -1) return '';

    const sliced = raw.slice(httpIndex).trim();
    const spaceIndex = sliced.indexOf(' ');
    return spaceIndex === -1 ? sliced : sliced.slice(0, spaceIndex);
  };

  return sanitize(input);
};
