import React, { useState } from "react";
import "./AddProductNew.less";
import GeneralInformation from "../../../components/GeneralInformation/GeneralInformation";
import Media from "../../../components/Media/Media";
import Pricing from "./Pricing";
// import Inventory from './Inventory';
// import Variation from './Variation';
// import Measurement from './Measurement';
// import Shipping from './Shipping';
import Category from "./Category";
import Status from "../../../components/Status/Status";
import TagsAndColors from "./TagsAndColors";
import axiosInstance from "../../../application-wide/axios/axios-instance";
import { NavLink, useNavigate } from "react-router-dom";
import Tags from "../../../components/Tags/Tags";
import Colors from "./Color";
import Loader from "../../../components/Loader";
import Notification from "../../../components/Notification";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";
import AddAmazonLink from "@src/components/AddAmazonLink/AddAmazonLink";
import { Button } from "@src/components/Common/Widgets";

// import Sidebar from '../Sidebar';

const AddProduct = () => {
  const navigate = useNavigate();

  const [generalInfo, setGeneralInfo] = useState({ name: "", description: "" });
  const [productLink, setProductLink] = useState("");
  const [media, setMedia] = useState([]);
  const [pricing, setPricing] = useState({ price: "", currency: "" });
  // const [inventory, setInventory] = useState({ sku: '', barcode: '', quantity: '' });
  // const [variations, setVariations] = useState([{ id: 1, type: '', value: '' }]);
  const [measurement, setMeasurement] = useState({
    size: "",
    customFields: {},
    active: false,
  });
  // const [shipping, setShipping] = useState({ weight: '', height: '', length: '', width: '' });
  // const [isPhysical, setIsPhysical] = useState(true);
  const [category, setCategory] = useState(null);
  const [gender, setGender] = useState(null);
  const [subCategory, setSubCategory] = useState(null);
  const [style, setStyle] = useState(null);
  const [tags, setTags] = useState([]);
  const [colors, setColors] = useState([]);
  const [status, setStatus] = useState("Draft");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true

    if (!generalInfo.name || !generalInfo.description) {
      throw new Error("General information is required.");
    }

    const productData = {
      name: generalInfo.name,
      description: generalInfo.description,
      productLink: productLink,
      files: media,
      price: parseFloat(pricing.price),
      currency: pricing.currency,
      category_id: category ? category.value : null,
      gender_id: gender ? gender.value : null,
      sub_category_id: subCategory ? subCategory.value : null,
      style_id: style ? style.value : null,
      measurement,
      status: status == "Published" ? true : false,
      tags,
      colors,
    };
    const formData = new FormData();
    for (const key in productData) {
      if (!["tags", "measurement", "colors", "files"].includes(key)) {
        formData.append(key, productData[key]);
      }
    }
    if (productData.tags) {
      productData.tags.forEach((item, index) => {
        formData.append(`tags[${index}]`, item);
      });
    }

    if (productData.measurement.length > 0) {
      productData.measurement.forEach((item, index) => {
        formData.append(`measurement[${index}][size]`, item.size);
        formData.append(`measurement[${index}][active]`, item.active);
        for (const fieldKey in item.customFields) {
          formData.append(
            `measurement[${index}][dimensions][${fieldKey}]`,
            item.customFields[fieldKey]
          );
        }
      });
    }

    // if(productData.measurement.length > 0){
    //   productData.measurement.forEach((item, index) => {
    //     for (const key in item) {
    //       formData.append(`measurement[${index}][${key}]`, item[key]);
    //     }
    //   });
    // }

    if (productData.colors) {
      Object.entries(productData.colors).forEach(([key, value]) => {
        formData.append(`colors[${key}]`, value);
      });
    }

    if (productData.files) {
      productData.files.forEach((fileData, index) => {
        formData.append(`files`, fileData.file); // Remove index for multiple files
      });
    }

    try {
      await axiosInstance.post("/products", formData);
      navigate("/dashboard/products"); // Navigate back to products list
    } catch (error) {
      console.error("Error adding product:", error);
      setError(`Something went wrong. Please try again later.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setError(null);
  };

  return (
    <div className="add-product-container">
      <UBUBreadCrumb
        items={[
          { title: "Dashboard" },
          {
            title: <NavLink to={"/dashboard/products"}>Products</NavLink>,
          },
          { title: "Create" },
        ]}
      />
      {loading && <Loader />}
      {error && (
        <Notification
          message={error}
          type="error"
          onClose={handleCloseNotification}
        />
      )}

      <div className="add-product-content">
        <div className="add-product-header">
          <h1>Add Product</h1>
          <button
            className="cancel-button"
            onClick={(e) => navigate("/dashboard/products")}
          >
            Cancel
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="tw-grid lg:tw-grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] tw-gap-5">
            <div>
              <GeneralInformation
                generalInfo={generalInfo}
                setGeneralInfo={setGeneralInfo}
                parent={"Product"}
                required
              />
              <Pricing pricing={pricing} setPricing={setPricing} required />
              <AddAmazonLink
                productLink={productLink}
                setProductLink={setProductLink}
                parent={"Product"}
                required
              />
              <Tags tags={tags} setTags={setTags} />
              <Colors colors={colors} setColors={setColors} />

              {/* <Measurement measurement={measurement} setMeasurement={setMeasurement} selectedCategory={category} /> */}

              {/* <Inventory inventory={inventory} setInventory={setInventory} /> */}
              {/* <Variation variations={variations} setVariations={setVariations} /> */}
              {/* <TagsAndColors tags={tags} setTags={setTags} colors={color} setColors={setColor} /> */}
              {/* <Shipping shipping={shipping} setShipping={setShipping} isPhysical={isPhysical} setIsPhysical={setIsPhysical} /> */}
            </div>
            <div>
              <Status
                status={status}
                setStatus={setStatus}
                parent={"Product"}
              />
              <Category
                category={category}
                setCategory={setCategory}
                gender={gender}
                setGender={setGender}
                subCategory={subCategory}
                setSubCategory={setSubCategory}
                style={style}
                setStyle={setStyle}
                measurement={measurement}
                setMeasurement={setMeasurement}
                required
              />
              <Media media={media} setMedia={setMedia} />
            </div>
          </div>
          <div className="submit-button-container">
            <Button
              type="submit"
              onClick={handleSubmit}
              loading={loading}
              className="submit-button"
              variant="solid"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
