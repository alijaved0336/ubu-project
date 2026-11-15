
import { object } from 'zod'
import {  emailValidation } from '../utils/formInputValidations'

const resetSchema = (t) => {
  return object({
    email: emailValidation(t),
  })
}
export default resetSchema
