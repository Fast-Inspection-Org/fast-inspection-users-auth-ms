import { BadRequestException, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'
import { envs } from 'src/envs/envs';
import { SendEmailDTO } from './send-email.dto';

@Injectable()
export class MailerService {

    public async sendEmail(sendEmailDTO: SendEmailDTO) {
        // se obtiene el transporte
        const transport = this.createTransport()

        // se define la propiedad "from" del mensaje
        sendEmailDTO.from = {
            name: envs.NAME_APP,
            address: envs.EMAIL_APP
        }
        // se envia el email
        try {
            await transport.sendMail(sendEmailDTO)
        } catch (error) {
            throw new BadRequestException(error.message)
        }

    }

    private createTransport() {
        // se crea un transporte
        return nodemailer.createTransport({
            host: envs.MAIL_HOST,
            port: parseInt(envs.MAIL_PORT),
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: envs.MAIL_USER,
                pass: envs.MAIL_PASSWORD,
            },
        })
    }

    

}
