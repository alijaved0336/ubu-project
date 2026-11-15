export interface IExhibitDocument {
  id: number;
  campaignId: number;
  documentOrder: number;
  description: string;
  hashtags?: string[];
  numberOfDeliverables: { type: string; count: number }[];
  campaignAcceptanceDeadline: string;
  publicationDates: string;
  totalCompensation: number;
  brandGuidelines?: string;
  numberOfRevisions?: number;
  turnAroundTime?: number;
  specialConditions?: string;
  documentUrl: string;
  createdAt: Date;
  updatedAt: Date;
}
