export interface INotification {
  sender: { id: number };
  receiver: { id: number };
  content: string;
  type: string;
  receiver_type: string;
  sender_type: string;
  isSeen: boolean;
  campaign_id?: number;
}
