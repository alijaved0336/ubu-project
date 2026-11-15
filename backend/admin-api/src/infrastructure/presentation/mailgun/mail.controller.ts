import { Controller, Post, UseInterceptors, UploadedFiles, BadRequestException, InternalServerErrorException, Inject, Body, Param } from '@nestjs/common';
import { MailUsecase } from '@use-cases/mail.usecase';
import UsecaseProxy, { MAIL_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
@Controller('mail')
export class MailController {
  constructor(
    @Inject(MAIL_USECASE_PROXY)
    private readonly mailUseCase: UsecaseProxy<MailUsecase>,
  ) {}

  @Post('send')
  async sendEmail(
    @Body('to') to: string,
    @Body('subject') subject: string,
    @Body('text') text: string,
    @Body('isHtml') isHtml: boolean = false, // Default to false if not passed
  ): Promise<any> {
    return this.mailUseCase.getInstance().sendEmail(to, subject, text, isHtml);
  }
}
