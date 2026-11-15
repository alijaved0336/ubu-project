import { useCallback } from 'react'
import { useAxios } from '../axios'

const REVIEW_API_URL = '/reviews'

const useCreateReview = () => {
  const { loading, error, value, fetch } = useAxios()

  const onCreateReview = useCallback(
    async (payload) => {
      return await fetch(
        'POST',
        REVIEW_API_URL,
        payload,
      )
    },
    [fetch]
  )

  return { loading, value, error, onCreateReview }
}

export default useCreateReview
