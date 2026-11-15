export interface IContract {
  id: number;
  brandSignUrl?: string;
  influencerSignUrl?: string;
  contractDocumentUrl: string;

  createdAt: Date;
  updatedAt: Date;
}
