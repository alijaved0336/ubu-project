import { Injectable } from '@nestjs/common';
import * as mailgun from 'mailgun-js';
import { from } from 'rxjs';

@Injectable()
export class MailGunService {
  private mg;
  private transporter;

  constructor() {
    // if (process.env.NODE_ENV === 'production')
    {
      // Use Mailgun for production
      this.mg = mailgun({
        apiKey: process.env.MAILGUN_API_KEY, // Store your API key securely (e.g., in .env file)
        domain: process.env.MAILGUN_DOMAIN, // Store your Mailgun domain securely (e.g., in .env file)
      });
    }
    //else
    // {
    //     // Use Nodemailer for local testing
    //     this.transporter = nodemailer.createTransport({
    //         host: 'localhost',
    //         port: 1025, // or any port your local SMTP server runs on (e.g., Mailhog, or similar local email testing tool)
    //         ignoreTLS: true,
    //     });
    // }
  }

  async sendEmail(
    to: string,
    subject: string,
    content: string,
    isHtml: boolean = false,
  ): Promise<any> {
    // if (process.env.NODE_ENV === 'production')
    {
      const data = {
        from: 'UBU <ace@ubu.live>',
        to: to,
        subject: subject,
        // Set either the 'text' or 'html' property based on the 'isHtml' flag
        ...(isHtml ? { html: content } : { text: content }),
      };

      try {
        const result = await this.mg.messages().send(data);
        return result;
      } catch (error) {
        console.error('Error sending email:', error);
        throw error;
      }
    }

  }
}
