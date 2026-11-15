import { Injectable, UnprocessableEntityException } from '@nestjs/common';

import { WeeklyTrackingSummary } from '../entities/weekly-tracking-summary.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AffiliateReportRepository {
  constructor(
    @InjectRepository(WeeklyTrackingSummary)
    private readonly affliateRepo: Repository<WeeklyTrackingSummary>,
  ) {}

  async validateNextEntryAndGetRange(fromDate: string) {
    console.log('Sheet week end date (raw):', fromDate);

    if (!fromDate) {
      return false;
    }

    // Fetch the last entry from the database
    const lastEntry = await this.affliateRepo.createQueryBuilder('summary').orderBy('summary.weekEndDate', 'DESC').getOne();

    if (!lastEntry) {
      console.log('No last entry found in the database.');
      return false;
    }

    const dbLastEntrytoDateString = lastEntry.weekEndDate;
    console.log('DB week End date (raw):', dbLastEntrytoDateString);

    // Convert `dbLastEntrytoDate` to a Date object
    const dbLastEntrytoDate = new Date(dbLastEntrytoDateString);

    // Convert `fromDate` (assumed in `YYYY/MM/DD` format) to a Date object
    const [year, month, day] = fromDate.split('/');
    const formattedFromDate = `${year}-${month}-${day}`;
    const fromDateObject = new Date(formattedFromDate);

    // Validate both dates
    if (isNaN(dbLastEntrytoDate.getTime())) {
      throw new Error('Invalid DB week end date');
    }
    if (isNaN(fromDateObject.getTime())) {
      throw new Error('Invalid sheet week end date');
    }

    console.log('DB week End date (formatted):', dbLastEntrytoDate);
    console.log('Sheet week End date (formatted):', fromDateObject);

    // Calculate the day difference
    const dayDifference = (fromDateObject.getTime() - dbLastEntrytoDate.getTime()) / (1000 * 60 * 60 * 24);

    console.log('Day Difference:', dayDifference);

    // Check if the `fromDate` is greater than the `dbLastEntrytoDate`
    if (dayDifference >= 1) {
      console.log('Sheet date is greater than or contiguous with DB date. Validation successful.');
      return false;
    } else {
      const nextDate = new Date(dbLastEntrytoDate.getTime() + 24 * 60 * 60 * 1000);
      console.log('Sheet date is not greater than DB date. Validation failed.', nextDate);
      return nextDate;
    }
  }

  async getMonthlySales(id: number, type: string) {
    const filterColumn = type === 'brand' ? 'brand_id' : 'influencer_id';

    const query = `
      WITH monthly_sales AS (
        SELECT 
            TO_CHAR(DATE_TRUNC('month', wts.week_start_date), 'YYYY-MM') AS month_year,
            SUM(wts.revenue) AS total_sales,
            SUM(wts.clicks) AS total_clicks,
            SUM(wts.items_ordered) AS total_items_ordered,
            SUM(wts.items_shipped) AS total_items_shipped,
            ROUND(SUM(wts.ad_fees ) * 0.2 ,2)AS total_ad_fees, -- 20% of total revenue
            MAX(wts.updated_at) AS last_updated_at, -- Latest update for the month
            sca.stripe_connected_account_id
        FROM 
            weekly_tracking_summaries wts
        LEFT JOIN
            stripe_connected_accounts sca
            ON wts.influencer_id = sca.influencer_id   
        WHERE 
            wts.${filterColumn} = $1
        GROUP BY 
            TO_CHAR(DATE_TRUNC('month', week_start_date), 'YYYY-MM'), sca.stripe_connected_account_id
        ORDER BY 
            TO_CHAR(DATE_TRUNC('month', week_start_date), 'YYYY-MM')
      )
      SELECT 
        json_agg(ms) AS total_monthly_sales, 
        (
          SELECT row_to_json(ms) 
          FROM monthly_sales ms 
          WHERE month_year = TO_CHAR(DATE_TRUNC('month', CURRENT_DATE), 'YYYY-MM')
        ) AS current_month_sales
      FROM monthly_sales ms;
    `;

    try {
      const result = await this.affliateRepo.query(query, [id]);

      // If no result, return empty objects to avoid null values
      const totalMonthlySales = result[0]?.total_monthly_sales || [];
      const currentMonthSales = result[0]?.current_month_sales || null;
      const stripe_connected_account_id = totalMonthlySales && totalMonthlySales[0]?.stripe_connected_account_id;

      console.log(`Monthly Sales Data for ${type} ID ${id}:`, result);

      return {
        type,
        totalMonthlySales,
        currentMonthSales,
        stripe_connected_account_id,
      };
    } catch (error) {
      console.error('Error executing monthly aggregation query:', error);
      throw new UnprocessableEntityException('Failed to calculate monthly aggregated data.');
    }
  }

  async create(data: Partial<WeeklyTrackingSummary>) {
    const newEntry = this.affliateRepo.create(data);
    return this.affliateRepo.save(newEntry);
  }

  async getAllEntries(id: number, type: string) {
    const filterColumn = type === 'brand' ? 'brand_id' : 'influencer_id';

    try {
      // Query to fetch all the entries based on brand_id or influencer_id
      const entries = await this.affliateRepo.createQueryBuilder('summary').where(`${filterColumn} = :id`, { id }).getMany();

      console.log(`Entries for ${type} ID ${id}:`, entries);

      // If no entries, return an empty array
      return entries || [];
    } catch (error) {
      console.error('Error fetching entries:', error);
      throw new UnprocessableEntityException('Failed to fetch the entries.');
    }
  }
}
