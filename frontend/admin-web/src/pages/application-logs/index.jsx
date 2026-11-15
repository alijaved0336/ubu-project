import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";
import ApplicationLogsProvider from "@src/components/Providers/ApplicationLogsProvider";
import ApplicationLogsHeader from "./ApplicationLogsHeader";
import ApplicationLogsTable from "./ApplicationLogsTable";
import ApplicationLogsFooter from "./ApplicationLogsFooter";

const ApplicationLogsIndex = () => {
  return (
    <ApplicationLogsProvider>
      <div>
        <UBUBreadCrumb
          items={[
            { title: "Dashboard" },
            {
              title: "Application Logs",
            },
          ]}
        />
        <ApplicationLogsHeader />
        <ApplicationLogsTable />
        <ApplicationLogsFooter />
      </div>
    </ApplicationLogsProvider>
  );
};

export default ApplicationLogsIndex;
