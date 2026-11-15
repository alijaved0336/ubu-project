/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { AwsS3Service } from '@infrastructure/services/aws-s3/aws-s3.service';
import { BadRequestException, UnprocessableEntityException, UploadedFiles } from '@nestjs/common';
import * as csvParser from 'csv-parser';
import { Readable } from 'stream';
import { AffiliateReportRepository } from '@infrastructure/orm/reposiories/affiliate-report.repository';
import { AffliateRepository } from '@infrastructure/orm/reposiories/affliate.repository';
import { StripeService } from '@infrastructure/services/stripe/stripe-service.service';

export class FileUsecase {
  constructor(
    private awsService: AwsS3Service,
    private AffiliateReportRepository: AffiliateReportRepository,
    private affliateRepository: AffliateRepository,
    private stripeService: StripeService,
  ) {}

  async uploadFiles(@UploadedFiles() files: Express.Multer.File[], folderName: string) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }
    const fileUrls = await this.awsService.uploadMultipleFiles(files, folderName);
    return { urls: fileUrls };
  }

  filterRowsWithRevenue(dataRows: any[]): any[] {
    return dataRows.filter(row => {
      const revenue = row.revenue ?? row['Revenue($)'] ?? 0;
      return +revenue > 0;
    });
  }
  
  async parseAndSaveCsvFromBuffer(buffer: Buffer) {
    const rows = await this.parseCsvFromBuffer(buffer);

    // Don't skip rows - parseCsvFromBuffer already handles header processing
    const dataRows = rows;
    let totalRevenue = 0;
    const customerId = process.env.UBU_STRIPE_CUSTOMER_ID;
    
    if (!customerId) {
      throw new Error('UBU_STRIPE_CUSTOMER_ID environment variable is not set');
    }

    const ubuCommissionRate = parseFloat(process.env.UBU_AFFILIATE_COMMISSION || '0');
   
    if (isNaN(ubuCommissionRate)) {
      throw new Error('UBU_AFFILIATE_COMMISSION environment variable is not a valid number');
    }

    const filteredRows: any[] = this.filterRowsWithRevenue(dataRows);
    
    // Check if there are any rows with revenue > 0
    if (filteredRows.length === 0) {
      return { 
        status: 200, 
        message: 'CSV processed successfully. No revenue to charge - all rows had $0 revenue.' 
      };
    }
    
    // First, calculate total revenue
    for (const row of filteredRows) {
      const revenue = +(row.revenue ?? row['Revenue($)'] ?? 0);
      totalRevenue += revenue;
    }

    const STRIPE_MINIMUM_CHARGE = 0.50;
    if (totalRevenue < STRIPE_MINIMUM_CHARGE) {
      return { 
        status: 200, 
        message: `CSV processed successfully. Total revenue ($${totalRevenue.toFixed(2)}) is below minimum charge amount.` 
      };
    }
    
    let totalPayableRevenue = 0
    // Stripe fee = 2.9% + $0.30
    const stripeFee = totalRevenue * 0.029 + 0.3;
    const taxPerRow = filteredRows.length > 0 ? stripeFee / filteredRows.length : 0;

    // Process each row
    for (const row of filteredRows) {
      const { tracking_id, clicks, items_ordered, revenue, from_date, to_date, ad_fees } = row;
      // Handle different possible column names
      const trackingId = tracking_id ?? row['Tracking ID'];
      const clicksCount = +(clicks ?? row['Clicks'] ?? 0);
      const itemsOrdered = +(items_ordered ?? row['Items Ordered'] ?? 0);
      const revenueAmount = revenue ?? row['Revenue($)'] ?? 0;
      const adFeesAmount = +(ad_fees ?? row['Ad Fees($)'] ?? 0);
      
      const record = await this.affliateRepository.findAffiliateById(trackingId);
      if (!record) {
        console.log(`No affiliate record found for tracking_id: ${trackingId}`);
        continue;
      }
      
      const numericRevenue = +revenueAmount;

      const stripeDeduction = taxPerRow;
      const ubuCommission = numericRevenue * ubuCommissionRate;

      const netRevenue = numericRevenue - stripeDeduction - ubuCommission;
      totalPayableRevenue += netRevenue

      await this.AffiliateReportRepository.create({
        trackingId: trackingId,
        weekStartDate: new Date(from_date),
        weekEndDate: new Date(to_date),
        clicks: clicksCount,
        itemsOrdered: itemsOrdered,
        itemsShipped: 0, // Assuming this is not provided in the CSV
        revenue: netRevenue >= 0 ? netRevenue : 0,
        adFees: adFeesAmount,
        brandId: record.brand_id,
        influncerId: record.influencer_id,
      });
    }
  
    if (!customerId) {
      throw new Error('Customer ID not found for Stripe charge');
    }
  
    const chargeResult = await this.stripeService.chargeAdmin(customerId, totalPayableRevenue??0);
    if (!chargeResult || chargeResult.status !== 'succeeded') {
      throw new Error('Stripe charge failed');
    }
    
    return { status: 201, message: `CSV processed and charged $${totalPayableRevenue.toFixed(2)??0} to admin successfully` };
  }
  
  private async parseCsvFromBuffer(buffer: Buffer): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const rows: any[] = [];
      const csvContent = buffer.toString('utf8');
      const lines = csvContent.split('\n').filter(line => line.trim() !== '');
  
      // Find the title line to extract dates
      const titleLine = lines[0];
      const dateMatch = titleLine.match(/from (\d{2}-\d{2}-\d{4}) to (\d{2}-\d{2}-\d{4})/);
      
      if (!dateMatch || dateMatch.length < 3) {
        return reject(new Error('Invalid CSV format: Missing or malformed date range in title line'));
      }
  
      const fromDate = this.formatDate(this.parseDate(dateMatch[1]));
      const toDate = this.formatDate(this.parseDate(dateMatch[2]));
  
      // Skip title line and process from header line
      const csvWithoutTitle = lines.slice(1).join('\n');
      const stream = Readable.from(csvWithoutTitle);
  
      stream
        .pipe(csvParser())
        .on('data', (data: Record<string, string>) => {
          
          const parsedRow = {
            tracking_id: data['Tracking ID'],
            from_date: fromDate,
            to_date: toDate,
            clicks: +data['Clicks'] || 0,
            items_ordered: +data['Items Ordered'] || 0,
            items_shipped: +data['Items Shipped'] || 0,
            revenue: +data['Revenue($)'] || 0.0,
            ad_fees: +data['Ad Fees($)'] || 0.0,
          };
  
          // Only add valid rows (skip header row if it gets through)
          if (parsedRow.tracking_id && parsedRow.tracking_id !== 'Tracking ID') {
            rows.push(parsedRow);
          }
        })
        .on('end', async () => {
          
          // Validate the entry
          if (rows.length > 0) {
            const isValidEntry = await this.AffiliateReportRepository.validateNextEntryAndGetRange(rows[0]?.from_date);
            if (isValidEntry !== false) {
              return reject(new UnprocessableEntityException(`Invalid Entry, Start date should be ${isValidEntry}`));
            }
          }
          
          resolve(rows);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  // Helper to parse date in mm-dd-yyyy format
  private parseDate(dateStr: string): Date {
    const [month, day, year] = dateStr.split('-').map((val) => parseInt(val, 10));
    return new Date(year, month - 1, day); // JS months are 0-based
  }

  // Helper to format date as yyyy/mm/dd
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading 0
    const day = String(date.getDate()).padStart(2, '0'); // Add leading 0
    return `${year}/${month}/${day}`;
  }
}
