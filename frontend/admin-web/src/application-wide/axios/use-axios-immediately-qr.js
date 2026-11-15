import { useEffect, useState } from 'react'
import axios from 'axios'
import axiosInstance from './axios-instance'

const useAxiosImmediatelyQR = (
  { method, url, data = {}, config = {} },
  immediately = true
) => {
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState(false)
  const [error, setError] = useState(false)
  useEffect(() => {
    if (immediately) {
      setLoading(true)
      axiosInstance.get(`${import.meta.env.VITE_BACKEND_API_BASE_URL}${url}`,config).then(value => {
      setValue(value)
      }).catch(error => {
        setLoading(false)
        setError(error)
        throw new Error(error.message)
      })
      setLoading(false)

    }
  }, [immediately])

  return { loading, error, value, fetch }
}

export default useAxiosImmediatelyQR
