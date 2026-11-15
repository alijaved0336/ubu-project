import { useCallback } from 'react'
import { useAxios } from '../axios'

const BRAND_API_URL = '/update-user'

const useUpdateUser = () => {
  const { loading, error, value, fetch } = useAxios()

  const onUpdateUser = useCallback(
    async (payload) => {
      return await fetch(
        'PUT',
        BRAND_API_URL,
        payload,
      )
    },
    [fetch]
  )

  return { loading, value, error, onUpdateUser }
}

export default useUpdateUser
