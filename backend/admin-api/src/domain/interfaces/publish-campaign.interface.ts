export interface IPublishCampaign {
  publishAmazonToInstagramAndUbu(userId: number, media: string[], content: string, url, brandId, affliateTag, campaign_id): Promise<void>;
}
