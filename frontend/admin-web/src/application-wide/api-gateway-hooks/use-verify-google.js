import { useCallback } from 'react'
import { useAxios } from '../axios'

const LOGIN_API_URL = '/verify-google?requestFrom=webApplication'

const useVerifyGoogle = () => {
  const { loading, error, value, fetch } = useAxios()

  const onVerifyLogin = useCallback(
    async (payload, sessionLog) => {
      return await fetch(
        'POST',
        LOGIN_API_URL,
         {access_token: payload,sessionLog} ,
        { headers: { 'X-Tracking-ID': 'auth-login' } }

      )
    },
    [fetch]
  )

  return { loading, value, error, onVerifyLogin }
}

export default useVerifyGoogle
