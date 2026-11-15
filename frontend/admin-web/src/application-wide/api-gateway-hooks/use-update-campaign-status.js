import { useCallback } from 'react'
import { useAxios } from '../axios'


const useUpdateCampaignStatus = () => {
  const { loading, error, value, fetch } = useAxios()

  const onUpdateCampaignStatus = useCallback(
    async (campaignId, status) => {
      return await fetch(
        'PATCH',
        `/campaign/${campaignId}/update_status`,
        {status: status},
      )
    },
    [fetch]
  )

  return { loading, value, error, onUpdateCampaignStatus }
}

export default useUpdateCampaignStatus
