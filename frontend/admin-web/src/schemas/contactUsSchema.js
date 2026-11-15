
import { object } from 'zod'
import { checkboxValidation, emailValidation, firstNameValidation, lastNameValidation, yourQuestionValidation } from '../utils/formInputValidations'

const getContactUsSchema = (t) => {
  return object({
    first_name: firstNameValidation(t),
    last_name: lastNameValidation(t),
    email: emailValidation(t),
    your_question:yourQuestionValidation(t)
  })
}
export default getContactUsSchema
