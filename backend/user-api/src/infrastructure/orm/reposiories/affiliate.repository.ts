import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AffiliateRepository {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource, // Inject the DataSource instance
  ) {}

  async findRevenueByInfluencerId(influencerId: number): Promise<{ revenue: number } | null> {
    const query = `
      SELECT SUM(wts.revenue) AS revenue
      FROM weekly_tracking_summaries wts 
      WHERE wts.influencer_id = $1
      GROUP BY wts.influencer_id
    `;

    // Execute the raw SQL query
    const result = await this.dataSource.query(query, [influencerId]);

    if (result.length === 0) return null;

    const revenue = Number(result[0].revenue); // Get the revenue from the result
    return { revenue };
  }
}
