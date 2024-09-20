import { Injectable } from "@nestjs/common";

export function sendEmail(dto: object){
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
        to: dto['to'],
        from: dto['from'],
        subject: dto['subject'],
        text: dto['text'],
        html: dto['html'],
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
    .catch((error: any) => {
        console.error(error)
    })
}


@Injectable()
export class EmailService {    
};