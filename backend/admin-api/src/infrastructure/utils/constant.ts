export enum CampaignStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  IN_PROGRESS = 'in-progress',
  CONTRACT_SIGNING = 'contract-signing',
  SUBMITTED = 'submitted',
  DISPUTED = 'disputed',
  COMPLETED = 'completed',
  PUBLISHING = 'publishing',
  PAYMENT_HELD = 'payment-held',
  FUNDS_TRANSFERRED = 'funds-transferred',
  REJECTED_REFUNDED = 'rejected-refunded',
}

export const GENDER_QUESTIONS_SR_NO = [2];

export enum SignInMethods {
  MANUAL = 'manual',
  GOOGLE = 'google',
  APPLE = 'apple',
  INSTAGRAM = 'instagram',
  FACEBOOK = 'facebook',
}

export const NotificationListTypes = [
  {
    id: 1,
    sender: 101,
    reciever: 201,
    notificationType: 'REQUEST',
    content: 'You have received a new message.',
    date: '2024-11-16T20:15:00Z',
  },
  {
    id: 2,
    sender: 102,
    reciever: 202,
    notificationType: 'INVITATION',
    content: 'You have been invited.',
    date: '2024-11-16T20:15:00Z',
  },
  {
    id: 3,
    sender: 103,
    reciever: 203,
    notificationType: 'PAYMENT',
    content: 'Payed for this.',
    date: '2024-11-16T20:15:00Z',
  },
];

export const STYLE_QUESTIONS_SR_NO = [16, 17, 31];
export const STYLE_QUESTIONS_SR_NO_MINOR = [16, 17];

export const UBU_TEAM_EMAILS = [
  { email: 'ali.riaz@codingcops.com', name: 'Ali Hassan' },
  { email: 'sohaib@codingcops.com', name: 'Sohaib Khan' },
  { email: 'irtaza.fiaz@codingcops.com', name: 'Irtaza Fiaz' },
  { email: 'usman.shahid@codingcops.com', name: 'Usman Shahid' },
];

export function convertDateFormat(dateString: string): string {
  const [year, month, day] = dateString.split('-');
  return `${month}-${day}-${year}`;
}
