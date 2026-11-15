const SUCCESS_CODES = ['200', '201']
const AUTHORIZATION_CODES = ['401', '403']

export const isSuccess = (status) => {
  if (status === undefined || status === null) {
    return false
  }
  return SUCCESS_CODES.includes(status.toString())
}

export const isUnAuthorized = (status) => {
  if (status === undefined || status === null) {
    return false
  }
  return AUTHORIZATION_CODES.includes(status.toString())
}
