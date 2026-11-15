import { useCallback } from 'react'
import { useAxios } from '../axios'

const LOGIN_API_URL = '/auth/verify-apple?requestFrom=webApplication'

const useVerifyApple = () => {
  const { loading, error, value, fetch } = useAxios()

  const onAppleVerifyLogin = useCallback(
    async (payload) => {
      return await fetch(
        'POST',
        LOGIN_API_URL,
         {payload} ,
        { headers: { 'X-Tracking-ID': 'auth-login' } }

      )
    },
    [fetch]
  )

  return { loading, value, error, onAppleVerifyLogin }
}

export default useVerifyApple
