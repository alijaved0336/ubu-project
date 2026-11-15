import { ICampaignDisputeConditions } from '@domain/interfaces/campaign-dispute.interface';
import { Between, ILike, Raw } from 'typeorm';

export const campaignDisputesConditions = (data: ICampaignDisputeConditions) => {
  const { search, resolution_action, status, endDate, startDate } = data;
  let whereConditions: any = [];

  if (search) {
    const searchNumber = Number(search);
    if (!isNaN(searchNumber)) {
      whereConditions.push({ campaign: { id: searchNumber } });
    }

    whereConditions.push({ admin_remarks: ILike(`%${search}%`) });
    whereConditions.push({ influencer_concerns: ILike(`%${search}%`) });
    whereConditions.push({ brand_concerns: ILike(`%${search}%`) });
    whereConditions.push({ raised_by: { first_name: ILike(`%${search}%`) } });
    whereConditions.push({ raised_by: { last_name: ILike(`%${search}%`) } });
    whereConditions.push({ raised_by: { email: ILike(`%${search}%`) } });
    whereConditions.push({
      against_by: { first_name: ILike(`%${search}%`) },
    });
    whereConditions.push({ against_by: { last_name: ILike(`%${search}%`) } });
    whereConditions.push({ against_by: { email: ILike(`%${search}%`) } });
  }

  let filterConditions: any = {};
  if (status) {
    filterConditions.status = Raw((alias) => `CAST(${alias} AS text) ILIKE '%${status}%'`);
  }

  if (resolution_action) {
    filterConditions.resolution_action = Raw((alias) => `CAST(${alias} AS text) ILIKE '%${resolution_action}%'`);
  }
  if (startDate && endDate) {
    const start = new Date(`${startDate}T00:00:00.000Z`);
    const end = new Date(`${endDate}T23:59:59.999Z`);
    filterConditions.created_at = Between(start, end);
  }

  const finalWhere = whereConditions.length > 0 ? whereConditions.map((wc: any) => ({ ...wc, ...filterConditions })) : filterConditions;

  return finalWhere;
};
