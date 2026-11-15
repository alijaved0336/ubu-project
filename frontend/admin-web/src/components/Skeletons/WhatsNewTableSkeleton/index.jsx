import { Flex, Skeleton } from "antd";

const WhatsNewTableSkeleton = () => {
  const rows = Array.from({ length: 5 });

  return (
    <Flex vertical gap={22}>
      <Flex vertical>
        <Flex className="tw-items-center tw-px-4 tw-h-12 tw-bg-[#f1f1f1]">
          <Flex justify="space-between" className="tw-w-full">
            {Array.from({ length: 4 }).map((_, colIndex) => (
              <Flex key={`header-${colIndex}`} className="tw-w-32">
                <Skeleton.Button active block />
              </Flex>
            ))}
          </Flex>
        </Flex>

        {rows.map((_, rowIndex) => (
          <Flex
            key={`row-${rowIndex}`}
            className="tw-items-center tw-border-b-2 tw-px-4 tw-h-12"
          >
            <Flex justify="space-between" className="tw-w-full">
              {Array.from({ length: 4 }).map((_, colIndex) => (
                <Flex
                  key={`row-${rowIndex}-col-${colIndex}`}
                  className="tw-w-32"
                >
                  <Skeleton.Button active block />
                </Flex>
              ))}
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};

export default WhatsNewTableSkeleton;
