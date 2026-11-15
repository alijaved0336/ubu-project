import React, { useState, useEffect } from "react";
import axiosInstance from "@src/application-wide/axios/axios-instance";
import { NavLink, useNavigate } from "react-router-dom";
import ItemCard from "@src/components/Common/Cards/ItemCard/ItemCard";
import { Button, Pagination, Flex } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import "./BrandProducts.less";
import Loader from "@src/components/Loader";
import {
  CustomButton,
  ItemCardV2,
  Text,
  UBUInput,
  UBUPagination,
  UBUSearch,
} from "@src/components";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";
import { Heading } from "@src/components/Common/Typography";
import NoData from "@src/components/NoData";
import PostIndexSkeleton from "@src/components/Skeletons/PostIndexSkeleton";
import ItemCardSkeleton from "@src/components/Common/Cards/ItemCard/ItemCardSkeleton";

// const { Search } = Input;

const ProductsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0); // Track total items for pagination

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const apiUrl = `/products?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`;
      try {
        const response = await axiosInstance.get(apiUrl);
        setData(response.data.products); // Assuming response data has a "products" field
        setTotalItems(response.data.total); // Assuming response data includes a "total" count of items
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error in fetching products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage, searchTerm]); // Re-fetch when page, limit, or search term changes

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleView = (id) => {
    navigate(`/dashboard/products/view/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/products/edit/${id}`);
  };

  const handleDelete = async (id) => {
    const apiUrl = `/products/${id}`;
    try {
      await axiosInstance.delete(apiUrl);
      setData(data.filter((item) => item.id !== id));
      setTotalItems(totalItems - 1);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handlePaginationChange = (pageNumber, pageSize) => {
    setCurrentPage(pageNumber);
    setItemsPerPage(pageSize);
  };

  return (
    <Flex vertical className="products-page-container">
      <UBUBreadCrumb
        items={[
          { title: "Dashboard" },
          {
            title: "Products",
          },
        ]}
      />
      {/* <Text className={"fs-20 fw-500"}>Product Listing</Text> */}



      <Flex justify="space-between" align="center">
        <div className="search-bar-container">
          <UBUSearch
            prefix={<SearchOutlined width={"20px"} height={"16px"} />}
            placeholder="Search Products..."
            onSearch={handleSearch}
            enterButton
          />
        </div>
        <UBUPagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          handlePaginationChange={handlePaginationChange}
        />
      </Flex>

      <div className="product_heading">
        <Heading level={3} className="tw-font-semibold">
          Product Listing
        </Heading>
        {
          data && data.length > 0 &&

        <CustomButton
          variant="black md"
          shape={"round"}
          onClick={() => navigate("/dashboard/products/add")}
        >
          Add Product
        </CustomButton>
      }
      </div>


      <div className="tw-grid lg:tw-grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] tw-grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] md:tw-justify-items-start tw-justify-items-center tw-gap-8">
      {loading ? (
        <>
          <ItemCardSkeleton />
          <ItemCardSkeleton />
          <ItemCardSkeleton />
          <ItemCardSkeleton />
          <ItemCardSkeleton />
          <ItemCardSkeleton />
          <ItemCardSkeleton />
          <ItemCardSkeleton />
          <ItemCardSkeleton />
          <ItemCardSkeleton />
        </>
      ) : (
        data?.map((product) => (
          <ItemCard
            type="product"
            key={product?.id}
            product={product}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
    </Flex>
  );
};

export default ProductsPage;
