import React, { useState, useEffect } from "react";
import { Flex, Select, Spin, Skeleton, Tag } from "antd";
import axiosInstance from "@src/application-wide/axios/axios-instance";
import { UBUTextArea, Text } from "@src/components";
// import { Flex, Text, Tag } from "@src/components";

const ProductDropdown = ({
  onSelectProduct,
  selectedProductId,
  disabled = false,
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/products?page=1&limit=100");
        setProducts(response.data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Render dropdown items
  const renderProductOption = (product) => (
    <Flex key={product.id} align="center" gap={20}>
      <img
        src={product.media?.[0]?.url || "https://via.placeholder.com/50"}
        alt={product.name}
        style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 5 }}
      />
      <div>
        <Text className="fs-16 fw-500">{product.name}</Text>
        <Flex gap={4}>
          <Text className="fs-14 fw-400 text-gray-400">
            {product.category.name}
          </Text>
          {/* {Object.keys(product.colors || {}).map((color) => (
            <Tag
              key={color}
              style={{
                backgroundColor: product.colors[color],
                borderRadius: "50%",
                width: 5,
                height: 15,
              }}
            />
          ))} */}
        </Flex>
      </div>
    </Flex>
  );

  return (
    <Select
      showSearch
      placeholder="Select a product"
      loading={loading}
      filterOption={(input, option) =>
        option.label.toLowerCase().includes(input.toLowerCase())
      }
      onSelect={(value) => {
        const selectedProduct = products.find(
          (product) => product.id === value
        );
        onSelectProduct(selectedProduct); // Pass selected product to parent
      }}
      style={{ width: "100%" }}
      optionLabelProp="label"
      disabled={disabled}
      value={selectedProductId}
    >
      {loading ? (
        <Select.Option disabled>
          <Skeleton size="small" />
        </Select.Option>
      ) : (
        products.map((product) => (
          <Select.Option
            key={product.id}
            value={product.id}
            label={product.name}
          >
            {renderProductOption(product)}
          </Select.Option>
        ))
      )}
    </Select>
  );
};

export default ProductDropdown;
