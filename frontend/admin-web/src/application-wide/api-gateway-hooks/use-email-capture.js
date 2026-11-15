import { useCallback } from 'react'
import { useAxios } from '../axios'

const API_URL = '/send-email-to-subscriber'

const useCaptureEmail = () => {
  const { loading, error, value, fetch } = useAxios()

  const onCaptureEmail = useCallback(
    async (payload) => {
      return await fetch(
        'POST',
        API_URL,
        payload,
      )
    },
    [fetch]
  )

  return { loading, value, error, onCaptureEmail }
}

export default useCaptureEmail
