import { useEffect } from 'react'
import useAxios from './use-axios.js'

const useAxiosImmediately = (
  { method, url, data = {}, config = {} },
  immediately = true
) => {
  const { loading, error, value, fetch } = useAxios()

  useEffect(() => {
    if (immediately) {
      fetch(method, url, data, config).catch(error => {
        throw new Error(error.message)
      })
    }
  }, [immediately])

  return { loading, error, value, fetch }
}

export default useAxiosImmediately
