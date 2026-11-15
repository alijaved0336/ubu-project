import { Heading } from "@src/components/Common/Typography";
import { useBodyScanCount } from "@src/components/Providers/BodyScanCountProvider";
import { Button } from "antd";

const BodyScanCountHeader = () => {
  const { bodyScanCount, setIsBodyScanEditModalOpen, isBodyScanEditModalOpen } =
    useBodyScanCount();

  return (
    <div className="tw-flex tw-mb-6 tw-justify-between tw-items-center">
      <Heading level={2} className="tw-font-manrope tw-font-semibold">
        Body Scan
      </Heading>
      {bodyScanCount.length > 0 && (
        <Button
          type="primary"
          onClick={() => setIsBodyScanEditModalOpen(!isBodyScanEditModalOpen)}
        >
          Edit Count
        </Button>
      )}
    </div>
  );
};

export default BodyScanCountHeader;
