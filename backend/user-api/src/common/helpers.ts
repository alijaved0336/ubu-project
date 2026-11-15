import { UserType } from "@infrastructure/orm/entities/questionnaire.entity";

export const getSelectedOptionsBySrNo = (userAnswers: any[], srNo: number, userType: UserType) => {
  const selectedOptions = userAnswers
    .filter((answer) => answer.question.sr_no === srNo && answer.question.user_type == userType)
    .flatMap((answer) => answer.selected_options);

  return selectedOptions.length > 0 ? selectedOptions : [];
};

export const formatConsumerProfile = (data: any) => {
  return {
    id: data.id,
    style: data.style,
    email_verified: data.email_verified,
    isScanned: data.isScanned,
    isSurveyDone: data.isSurveyDone,
    complexion: data.complexion,
    shape: data.shape,
    gender: data.gender,
    height: data.height,
    weight: data.weight,
    age: data.age,
    user: {
      id: data.user?.id,
      email: data.user?.email,
      first_name: data.user?.first_name,
      last_name: data.user?.last_name,
      phone_number: data.user?.phone_number,
      address: data.user?.address,
      avatar: data.is_influencer ? data.user?.influencer?.avatar :  data.user?.consumer?.avatar ,
      is_brand: data.user?.is_brand,
      is_influencer: data.user?.is_influencer,
      is_consumer: data.user?.is_consumer,
      is_deleted: data.user?.is_deleted,
    },
  };
};
