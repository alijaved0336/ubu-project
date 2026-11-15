import React, { useEffect, useState, useCallback } from "react";
import { UBUPagination, UBUSearch } from "@src/components";
import { SearchOutlined } from "@ant-design/icons";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";
import Container from "@src/components/Common/Container/Container";
import { Heading } from "@src/components/Common/Typography";
import axiosInstance from "@src/application-wide/axios/axios-instance";
import WhatsNewTableSkeleton from "@src/components/Skeletons/WhatsNewTableSkeleton";

const WaitlistUsers = () => {
    const [users, setUsers] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [filters, setFilters] = useState({
        currentPage: 1,
        itemsPerPage: 10,
        searchTerm: "",
    });
    const [loading, setLoading] = useState(false);

    // Fetch waitlist users with pagination & search
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/subscribed-users", {
                params: {
                    page: filters.currentPage,
                    limit: filters.itemsPerPage,
                    search: filters.searchTerm,
                },
            });

            setUsers(response.data.subscribers || []);
            setTotalCount(response.data.totalCount || 10);
            console.log(response.data.totalCount)
        } catch (error) {
            console.error("Error fetching waitlist users:", error);
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
                <UBUBreadCrumb items={[{ title: "Dashboard" }, { title: "Waitlist Users" }]} />

                <div className="tw-flex tw-justify-between tw-items-center tw-flex-wrap">
                    <Heading level={3} className="tw-font-bold tw-text-gray-900">
                        Waitlist Users
                    </Heading>
                </div>

                {/* Search & Pagination positioned at the top */}
                <div className="tw-flex tw-my-6 tw-justify-between tw-gap-4">
                    <UBUSearch
                        prefix={<SearchOutlined />}
                        placeholder="Search waitlist users..."
                        onSearch={handleSearch}
                        className="tw-w-1/3"
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

                {/* Table or Loader */}
                {loading ? (
                    <WhatsNewTableSkeleton />
                ) : (
                    <div className="tw-overflow-x-auto">
                        <table className="tw-w-full tw-border-collapse tw-bg-white tw-shadow-md tw-rounded-lg">
                            <thead>
                                <tr className="tw-bg-gray-200">
                                    <th className="tw-p-3 tw-text-left">Email</th>
                                    <th className="tw-p-3 tw-text-left">Phone</th>
                                    <th className="tw-p-3 tw-text-left">Page</th>
                                    <th className="tw-p-3 tw-text-left">Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="tw-border-b">
                                        <td className="tw-p-3">{user.email || "N/A"}</td>
                                        <td className="tw-p-3">{user.phone_number || "N/A"}</td>
                                        <td className="tw-p-3">{user.page}</td>
                                        <td className="tw-p-3">{new Date(user.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}

            </div>
        </Container>
    );
};

export default WaitlistUsers;
