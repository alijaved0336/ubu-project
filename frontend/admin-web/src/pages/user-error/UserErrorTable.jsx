import NoData from "@src/components/NoData";
import { getFormattedDate } from "@src/utils/helpers";
import { useUserError } from "@src/components/Providers/UserErrorProvider";
import WhatsNewTableSkeleton from "@src/components/Skeletons/WhatsNewTableSkeleton";

const UserErrorTable = () => {
  const {
    allUserErrors,
    isUserErrorLoading,
    filters: { searchTerm },
  } = useUserError();

  return (
    <>
      {isUserErrorLoading ? (
        <WhatsNewTableSkeleton />
      ) : allUserErrors.length > 0 ? (
        <div className="campaign-index-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Error Message</th>
                <th>Email</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Occured On</th>
              </tr>
            </thead>
            <tbody>
              {allUserErrors.map((uE, index) => (
                <tr key={uE?.id}>
                  <td>{index + 1}</td>
                  <td>{uE.message}</td>
                  <td>{uE.user.email}</td>
                  <td>{uE.user.first_name}</td>
                  <td>{uE.user.last_name}</td>
                  <td>{getFormattedDate(uE.created_at, "MMMM D, YYYY h:mm A")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          {searchTerm ? (
            <NoData
              isMessage
              message={`Nothing found against this search "${searchTerm}"`}
            />
          ) : (
            <NoData
            isMessage
            message={`No error has occured yet`}
            />
          )}
        </>
      )}
    </>
  );
};

export default UserErrorTable;
