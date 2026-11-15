import Select from "react-select";
import PropTypes from "prop-types";
import axiosInstance from "../../../application-wide/axios/axios-instance";
import "./ProductDropDown.less";

import { useEffect, useState } from "react";
import { Skeleton } from "antd";

const ProductDropDown = ({ products, setProducts, required, isLoading }) => {
  const [productOptions, setproductOptions] = useState([]);

  useEffect(() => {
    // Fetch product options from the backend
    const fetchProductOptions = async () => {
      try {
        const response = await axiosInstance.get("posts/product/get_products"); // Adjust the endpoint as needed
        const options = response.data.map((product) => ({
          value: product.id,
          label: product.name,
        }));
        setproductOptions(options);
      } catch (error) {
        console.error("Error fetching product options:", error);
      }
    };

    fetchProductOptions();
  }, []);

  const handleProductChange = (selectedOptions) => {
    setProducts(
      selectedOptions ? selectedOptions.map((option) => option.value) : []
    );
  };

  return (
    <div className="products">
      <h2>Products</h2>
      {isLoading ? (
        <Skeleton.Button block active size="large" />
      ) : (
        <Select
          isMulti
          value={productOptions.filter((option) =>
            products.includes(option.value)
          )}
          onChange={handleProductChange}
          options={productOptions}
          placeholder="Select products"
          className="react-select-container"
          classNamePrefix="react-select"
          required={required}
        />
      )}
    </div>
  );
};

ProductDropDown.propTypes = {
  products: PropTypes.array,
  setProducts: PropTypes.func,
  required: PropTypes.bool,
  isLoading: PropTypes.bool,
};

export default ProductDropDown;
