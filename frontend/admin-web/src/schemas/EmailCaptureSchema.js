
import { object } from 'zod'
import {  emailValidation,  } from '../utils/formInputValidations'

const getEmailCaptureSchema = (t) => {
  return object({
    email: emailValidation(t),
  })
}
export default getEmailCaptureSchema
