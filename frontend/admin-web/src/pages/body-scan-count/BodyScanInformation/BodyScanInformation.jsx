import NoData from "@src/components/NoData";
import { useBodyScanCount } from "@src/components/Providers/BodyScanCountProvider";
import { CustomButton, Text, UBUModal } from "@src/components";
import { Flex, Grid, InputNumber, Skeleton } from "antd";

const BodyScanInformation = () => {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const {
    isBodyScanCountLoading,
    bodyScanCount,
    handleInitiateCount,
    isBodyScanEditModalOpen,
    setIsBodyScanEditModalOpen,
    isEditing,
    editBodyScanValue,
    onInputNumberChange,
    handleEditCount,
  } = useBodyScanCount();
  return (
    <div>
      {isBodyScanCountLoading && (
        <Skeleton.Button block style={{ width: "300px" }} active size="small" />
      )}
      {!bodyScanCount.length > 0 && !isBodyScanCountLoading && (
        <NoData
          componentName="BodyScanCount"
          onClick={handleInitiateCount}
          isMessage={false}
        />
      )}

      {bodyScanCount.length > 0 && !isBodyScanCountLoading && (
        <Text className="tw-mt-3 fw-600 fs-14 tw-text-black-60">
          Body Scan has been performed {"  "}
          <Text className="fs-24 fw-600">{bodyScanCount[0].count}</Text>
          {"  "}
          times.
        </Text>
      )}

      <UBUModal
        title="Edit Body Scan Count"
        open={isBodyScanEditModalOpen}
        onCancel={() => {
          setIsBodyScanEditModalOpen(!isBodyScanEditModalOpen);
        }}
        width={screens.xs ? "80%" : screens.sm ? "30%" : "10%"}
        height={screens.xs ? "40%" : screens.sm ? "40%" : "50%"}
        footer={[
          <CustomButton
            onClick={() => handleEditCount()}
            loading={isEditing}
            variant={"black"}
            key={"submit"}
          >
            Submit
          </CustomButton>,
        ]}
      >
        <Flex vertical className="tw-gap-4">

        <>Please enter a number between 0 and 20</>
        <InputNumber
          defaultValue={0}
          min={0}
          max={20}
          size="large"
          value={editBodyScanValue[0]?.count}
          onChange={onInputNumberChange}
          />
          </Flex>
      </UBUModal>
    </div>
  );
};

export default BodyScanInformation;
