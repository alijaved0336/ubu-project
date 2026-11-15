import { useCallback } from 'react'
import { useAxios } from '../axios'

const BRAND_API_URL = '/register?requestFrom=webApplication'

const useRegistration = () => {
  const { loading, error, value, fetch } = useAxios()

  const onRegistration = useCallback(
    async (payload) => {
      return await fetch(
        'POST',
        BRAND_API_URL,
        payload,
      )
    },
    [fetch]
  )

  return { loading, value, error, onRegistration }
}

export default useRegistration
