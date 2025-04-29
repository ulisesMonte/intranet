import { Injectable } from '@nestjs/common';

import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailsService {
  constructor(private mailerService: MailerService) {
    
  }

  async sendUserConfirmation(user:string,email:string){
    console.log(email)
    console.log(user)
    try{
      await this.mailerService.sendMail( {
        to: email,
        subject:"Cofirmacion de inicio de sesion",
        template: 'welcome',
        context:{
          userName:user,
        }
      })
    }catch(error){
      console.log(error)
    }
  } 


  async sendCloseUserConfirmation(user:string,email:string,horas:number){
    console.log(email)
    console.log(user)
    try{
      await this.mailerService.sendMail( {
        to: email,
        subject:"Cofirmacion de cierre de sesion",
        template: 'bye',
        context:{
          userName:user,
          horas:horas,
        }
      })
  }catch(error){
    console.log(error)
  }
}

}
