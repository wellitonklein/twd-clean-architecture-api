import { RegisterAndSendEmailController } from '@/web-controllers'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { MongodbUserRepository } from '@/external/repositories/mongodb'
import { RegisterAndSendEmail } from '@/usecases/register-and-send-email'
import { SendEmail } from '@/usecases/send-email'
import { NodeMailerEmailService } from '@/external/mail-services'
import { getEmailOptions } from '@/main/config/email'

export const makeRegisterAndSendEmailController = (): RegisterAndSendEmailController => {
  const mongodbUserRepository = new MongodbUserRepository()
  const registerUserOnMailingListUseCase = new RegisterUserOnMailingList(mongodbUserRepository)
  const emailService = new NodeMailerEmailService()
  const sendEmailUseCase = new SendEmail({
    options: getEmailOptions(),
    service: emailService
  })
  const registerAndSendEmailUseCase = new RegisterAndSendEmail({
    registerUserOnMailingList: registerUserOnMailingListUseCase,
    sendEmail: sendEmailUseCase
  })
  const registerUserController = new RegisterAndSendEmailController(registerAndSendEmailUseCase)
  return registerUserController
}
