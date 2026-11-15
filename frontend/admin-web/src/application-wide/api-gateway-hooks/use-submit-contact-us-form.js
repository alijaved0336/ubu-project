import { useCallback } from 'react'
import { useAxios } from '../axios'

const API_URL = '/contact-us'

const useSubmitContactUsForm = () => {
  const { loading, error, value, fetch } = useAxios()

  const onSubmitContactUsForm = useCallback(
    async (payload) => {
      return await fetch(
        'POST',
        API_URL,
        payload,
      )
    },
    [fetch]
  )

  return { loading, value, error, onSubmitContactUsForm }
}

export default useSubmitContactUsForm
