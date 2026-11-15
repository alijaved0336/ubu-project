import { Injectable, NotFoundException } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class TwilioService {
  private client: Twilio;
  private readonly SSID = process.env.TWILIO_ACCOUNT_SSID;
  private readonly TOKEN = process.env.TWILIO_AUTH_TOKEN;
  private readonly FROM_NUM = process.env.TWILIO_FROM_NUMBER;

  constructor() {
    const token = process.env.TWILIO_AUTH_TOKEN;
    // Initialize the Twilio client with environment variables
    this.client = new Twilio(this.SSID, this.TOKEN);
  }

  /**
   * Sends a message using Twilio
   * @param to Recipient's phone number
   * @param from Sender's phone number (your Twilio number)
   * @param content Message content
   * @returns Promise<any> Result of the send operation
   */
  async sendMessage(phone_number: string, content: string): Promise<any> {
    try {
      const result = await this.client.messages.create({
        from: this.FROM_NUM,
        to: phone_number,
        body: content,
      });
      return result;
    } catch (error) {
      console.error('Error sending message via Twilio:', error.message);
      throw new NotFoundException(error.message);
    }
  }
}
