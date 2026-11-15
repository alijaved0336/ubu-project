import { ICampaignPaymentConditions } from '@domain/interfaces/campaign-payement.interface';
import { CampaignPaymentStatus } from '@infrastructure/orm/entities/campaign-payment.entity';
import { Between, ILike, In, Raw } from 'typeorm';

export const campaignPaymentConditions = (data: ICampaignPaymentConditions) => {
  const { userId, userType, search, status, endDate, startDate } = data;

  const baseWhere =
    userType === 'brandUser'
      ? { user: { id: userId } }
      : {
          campaign: { influencer: { user: { id: userId } } },
          status: In([CampaignPaymentStatus.SUCCEEDED]),
        };

  let whereConditions: any[] = [];

  if (search) {
    const numericCampaignId = Number(search);
    const isNumeric = !isNaN(numericCampaignId);

    if (isNumeric) {
      whereConditions.push({ campaign: { id: numericCampaignId } });
    }

    if (userType === 'brandUser') {
      whereConditions.push({
        campaign: {
          influencer: { user: { first_name: ILike(`%${search}%`) } },
        },
      });
      whereConditions.push({
        campaign: {
          influencer: { user: { last_name: ILike(`%${search}%`) } },
        },
      });
    } else {
      whereConditions.push({
        user: { brand: { brand_name: ILike(`%${search}%`) } },
      });
    }
  }

  if (!whereConditions.length) {
    whereConditions.push(baseWhere);
  }

  let filterConditions: any = {};
  if (status) {
    filterConditions.status = Raw((alias) => `CAST(${alias} AS text) ILIKE '%${status}%'`);
  }

  if (startDate && endDate) {
    const start = new Date(`${startDate}T00:00:00.000Z`);
    const end = new Date(`${endDate}T23:59:59.999Z`);
    filterConditions.created_at = Between(start, end);
  }

  const finalWhere = whereConditions.length > 0 ? whereConditions.map((wc: any) => ({ ...wc, ...filterConditions })) : filterConditions;

  return finalWhere;
};
