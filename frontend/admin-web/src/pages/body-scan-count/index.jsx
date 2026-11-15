import BodyScanCountProvider from "@src/components/Providers/BodyScanCountProvider";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";
import BodyScanInformation from "./BodyScanInformation/BodyScanInformation";
import BodyScanCountHeader from "./BodyScanHeader";

const BodyScanCountIndex = () => {
  return (
    <BodyScanCountProvider>
      <div>
        <UBUBreadCrumb
          items={[
            { title: "Dashboard" },
            {
              title: "Body Scan Count",
            },
          ]}
        />
        <BodyScanCountHeader />
        <BodyScanInformation />
      </div>
    </BodyScanCountProvider>
  );
};

export default BodyScanCountIndex;
