import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";
import UserErrorProvider from "@src/components/Providers/UserErrorProvider";
import UserErrorHeader from "./UserErrorHeader";
import UserErrorTable from "./UserErrorTable";

const UserErrorIndex = () => {
  return (
    <UserErrorProvider>
      <div className="tw-mb-4">
        <UBUBreadCrumb
          items={[
            { title: "Dashboard" },
            {
              title: "Body Gram Errors",
            },
          ]}
        />
        <UserErrorHeader />
        <UserErrorTable />
      </div>
    </UserErrorProvider>
  );
};

export default UserErrorIndex;
