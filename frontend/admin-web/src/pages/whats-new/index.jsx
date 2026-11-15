import WhatsNewHeader from "./WhatsNewHeader";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";
import WhatsNewProvider from "@src/components/Providers/WhatsNewProvider";
import WhatsNewTable from "./WhatsNewTable";

const WhatsNewIndex = () => {
  return (
    <WhatsNewProvider>
      <div>
        <UBUBreadCrumb
          items={[
            { title: "Dashboard" },
            {
              title: "Whats New",
            },
          ]}
        />
        <WhatsNewHeader />
        <WhatsNewTable />
      </div>
    </WhatsNewProvider>
  );
};

export default WhatsNewIndex;
