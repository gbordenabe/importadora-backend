import { Module } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';

@Module({
  providers: [EmailService],
  imports: [
    MailerModule.forRootAsync({
      inject: [],
      useFactory: () => {
        const mailerOptions: MailerOptions = {
          defaults: {
            from: "'Importadora'",
          },
          transport: {
            service: 'gmail',
            host: 'smpt.gmail.com', //'sandbox.smtp.mailtrap.io',
            port: 456, //2525
            auth: {
              user: process.env.EMAIL_SERVICE,
              pass: process.env.EMAIL_API_KEY,
            },
            tls: {
              rejectUnauthorized: false,
            },
          },
        };
        return mailerOptions;
      },
    }),
  ],
  exports: [EmailService],
})
export class EmailModule {}
