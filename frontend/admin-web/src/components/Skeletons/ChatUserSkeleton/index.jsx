import { Flex, Skeleton } from 'antd'

const ChatUserSkeleton = () => {
  return (
    <Flex className="tw-flex-col tw-w-full tw-xs:flex-row" gap={16} >
    <Flex className='tw-items-center' gap={12}>
      <Skeleton.Avatar active block size='large' />
      <Skeleton.Button active block size="small" />
    </Flex>
  </Flex>
  )
}

export default ChatUserSkeleton