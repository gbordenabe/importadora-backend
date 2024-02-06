import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendEmailMsg(email: string, subject: string, msg: string) {
    await this.mailerService.sendMail({
      to: email,
      subject,
      text: msg,
    });
  }
  async sendEmailHtml(email: string, subject: string, html: string) {
    await this.mailerService.sendMail({
      to: email,
      subject,
      html,
    });
  }
}
