import PropTypes from "prop-types";
import "./AddedProductsListing.less";

import { Button, Flex } from "antd";

const AddedProductsListing = ({ products, handleRemoveProduct }) => {
  return (
    <div className="added-Products-Listing">
      <h2>Added Products</h2>
      {products.map((product, index) => (
        <Flex
          vertical
          className="tw-p-6 tw-mb-3 tw-border-2 tw-rounded-lg tw-gap-4"
          key={index}
        >
          {/* <AmazonProductInformation currentProduct={product} /> */}
          <h2 className="tw-font-bold">{product.title}</h2>
          <p>{product.description}</p>
          <h3 className="tw-font-bold">Price: ${product.price}</h3>
          {product.images.length > 0 && (
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={`Product ${idx}`}
                  style={{
                    width: "130px",
                    height: "130px",
                    objectFit: "cover",
                  }}
                />
              ))}
            </div>
          )}

          <Button
            type="primary"
            onClick={() => handleRemoveProduct(index)}
            style={{ marginTop: "10px" }}
          >
            Remove Product
          </Button>
        </Flex>
      ))}
    </div>
  );
};

AddedProductsListing.propTypes = {
  products: PropTypes.array,
  handleRemoveProduct: PropTypes.func,
};

export default AddedProductsListing;
