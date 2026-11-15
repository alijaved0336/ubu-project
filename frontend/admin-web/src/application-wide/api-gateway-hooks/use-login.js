import { useCallback } from 'react'
import { useAxios } from '../axios'

const LOGIN_API_URL = '/login?requestFrom=webApplication'

const useLogin = () => {
  const { loading, error, value, fetch } = useAxios()

  const onLogin = useCallback(
    async (email, password,sessionLog) => {
      return await fetch(
      'POST',
        LOGIN_API_URL,
        { email, password , sessionLog },
        { headers: { 'X-Tracking-ID': 'auth-login' } }
      )
    },
    [fetch]
  )

  return { loading, value, error, onLogin }
}

export default useLogin
