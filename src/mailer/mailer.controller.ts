import { Body, Controller, Post } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SendEmailDTO } from './send-email.dto';
import { MessagePattern, RpcException } from '@nestjs/microservices';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) { }

  @MessagePattern('sendEmail')
  public async sendEmail(sendEmailDTO: SendEmailDTO) {
    try {
      await this.mailerService.sendEmail(sendEmailDTO)
      return { success: true }
    } catch (error) {
      console.log(error)
      throw new RpcException({
        message: error.message,
        status: error.status
      })
    }
  }
}
