import { Flex, Skeleton, Typography } from 'antd'

const ChatBoxSkeleton = () => {
  return (
    <Flex className="tw-flex-col tw-w-full" gap={16}>

    <Flex className="tw-items-center tw-justify-end tw-w-1/2 tw-ml-auto" gap={12}>
        <Skeleton.Button active block size="small" />
        <Skeleton.Avatar active block size="large" />
    </Flex>

    <Flex className="tw-items-center tw-justify-start tw-w-1/2" gap={12}>
        <Skeleton.Avatar active block size="large" />
        <Skeleton.Button active block size="small" />
    </Flex>
    
    <Flex className="tw-items-center tw-justify-end tw-w-1/2 tw-ml-auto" gap={12}>
        <Skeleton.Button active block size="small" />
        <Skeleton.Avatar active block size="large" />
    </Flex>

    <Flex className="tw-items-center tw-justify-start tw-w-1/2" gap={12}>
        <Skeleton.Avatar active block size="large" />
        <Skeleton.Button active block size="small" />
    </Flex>

    <Flex className="tw-items-center tw-justify-end tw-w-1/2 tw-ml-auto" gap={12}>
        <Skeleton.Button active block size="small" />
        <Skeleton.Avatar active block size="large" />
    </Flex>

    <Flex className="tw-items-center tw-justify-start tw-w-1/2" gap={12}>
        <Skeleton.Avatar active block size="large" />
        <Skeleton.Button active block size="small" />
    </Flex>

    <Flex className="tw-items-center tw-justify-end tw-w-1/2 tw-ml-auto" gap={12}>
        <Skeleton.Button active block size="small" />
        <Skeleton.Avatar active block size="large" />
    </Flex>

    <Flex className="tw-items-center tw-justify-start tw-w-1/2" gap={12}>
        <Skeleton.Avatar active block size="large" />
        <Skeleton.Button active block size="small" />
    </Flex>

    <Flex className="tw-items-center tw-justify-end tw-w-1/2 tw-ml-auto" gap={12}>
        <Skeleton.Button active block size="small" />
        <Skeleton.Avatar active block size="large" />
    </Flex>

    <Flex className="tw-items-center tw-justify-start tw-w-1/2" gap={12}>
        <Skeleton.Avatar active block size="large" />
        <Skeleton.Button active block size="small" />
    </Flex>

  </Flex>
  )
}

export default ChatBoxSkeleton