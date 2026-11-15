import React, { useEffect, useState, useCallback } from "react";
import { UBUPagination, UBUSearch } from "@src/components";
import { SearchOutlined } from "@ant-design/icons";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";
import Container from "@src/components/Common/Container/Container";
import { Heading } from "@src/components/Common/Typography";
import axiosInstance from "@src/application-wide/axios/axios-instance";
import WhatsNewTableSkeleton from "@src/components/Skeletons/WhatsNewTableSkeleton";

const SignupUsers = () => {
  const [users, setUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    searchTerm: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch users with pagination & search
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/signup-users", {
        params: {
          page: filters.currentPage,
          limit: filters.itemsPerPage,
          search: filters.searchTerm,
        },
      });

      console.log(response.data.totalCount )
      setUsers(response.data.users || []);
      setTotalCount(response.data.totalCount || 10);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const handleSearch = useCallback((value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      currentPage: 1,
      searchTerm: value,
    }));
  }, []);

  const handlePageChange = useCallback((pageNumber, pageSize) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      currentPage: pageNumber,
      itemsPerPage: pageSize,
    }));
  }, []);

  return (
    <Container className="tw-py-6">
      <div className="tw-space-y-6">
        <UBUBreadCrumb items={[{ title: "Dashboard" }, { title: "Signup Users" }]} />
        
        <div className="tw-flex tw-justify-between tw-items-center tw-flex-wrap">
          <Heading level={3} className="tw-font-bold tw-text-gray-900">
            Signup Users
          </Heading>
        </div>

        {/* Search & Pagination positioned at the top */}
        <div className="tw-flex tw-my-6 tw-justify-between tw-gap-4">
        {console.log(filters.currentPage)}
          <UBUSearch
            prefix={<SearchOutlined />}
            placeholder="Search..."
            onSearch={handleSearch}
            className="tw-w-full xl:tw-basis-1/2"
            enterButton
          />
        
          {totalCount > 0 && (
            <UBUPagination
              currentPage={filters.currentPage}
              itemsPerPage={filters.itemsPerPage}
              totalItems={totalCount}
              className="tw-w-auto tw-ml-auto"
              handlePaginationChange={handlePageChange}
            />
          )}
        </div>

        {/* Users Table */}
        <div className="tw-overflow-x-auto tw-bg-white tw-shadow-lg tw-rounded-lg">
          {loading ? (
           <WhatsNewTableSkeleton></WhatsNewTableSkeleton>
          ) : (
            <table className="tw-w-full tw-border-collapse tw-rounded-lg">
              <thead className="tw-bg-gray-100 tw-text-gray-700">
                <tr className="tw-text-left tw-bg-gray-20">
                  <th className="tw-px-4 tw-py-3 tw-text-sm tw-font-semibold">Email</th>
                  <th className="tw-px-4 tw-py-3 tw-text-sm tw-font-semibold">Name</th>
                  <th className="tw-px-4 tw-py-3 tw-text-sm tw-font-semibold">Created At</th>
                  <th className="tw-px-4 tw-py-3 tw-text-sm tw-font-semibold">Address</th>
                  <th className="tw-px-4 tw-py-3 tw-text-sm tw-font-semibold">City</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`tw-border-b tw-transition hover:tw-bg-gray-100 ${
                        index % 2 === 0 ? "tw-bg-gray-50" : "tw-bg-white"
                      }`}
                    >
                      <td className="tw-px-4 tw-py-3 tw-text-blue-600 tw-font-medium">
                        {user.email}
                      </td>
                      <td className="tw-px-4 tw-py-3">{user.first_name}</td>
                      <td className="tw-px-4 tw-py-3">{new Date(user.created_at).toLocaleString()}</td>
                      <td className="tw-px-4 tw-py-3">{user.address || "N/A"}</td>
                      <td className="tw-px-4 tw-py-3">{user.city || "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="tw-text-center tw-p-4 tw-text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination again at the bottom if needed */}
       
      </div>
    </Container>
  );
};

export default SignupUsers;
