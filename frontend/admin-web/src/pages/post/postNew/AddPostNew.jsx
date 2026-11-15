import Tags from "../../../components/Tags/Tags";
import Media from "../../../components/Media/Media";
import Status from "../../../components/Status/Status";
import Notification from "../../../components/Notification";
import AmazonProductInformation from "./AmazonProductInformation";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";
import axiosInstance from "../../../application-wide/axios/axios-instance";
import GeneralInformation from "../../../components/GeneralInformation/GeneralInformation";
import ConfirmationModal from "@src/components/ConfirmationModal/ConfirmationModal";
import "./AddPostNew.less";

import { useEffect, useState } from "react";
import { Button, Flex, Input, Modal, Skeleton, Tooltip, message } from "antd";
import { NavLink, useNavigate } from "react-router-dom";

import { validateAmazonLink, validateShortAmazonLink } from "@src/utils/regex";
import AddedProductsListing from "./AddedProductsListing";
import { getTypeByExtension } from "@src/utils/helpers";
import { maxAllowedAffiliatedProducts } from "@src/utils/constant";
import { CustomButton } from "@src/components";
import { Heading } from "@src/components/Common/Typography";

const AddPostNew = () => {
  const navigate = useNavigate();
  const [generalInfo, setGeneralInfo] = useState({ name: "", description: "" });
  const [manuallyAddedMedia, setManuallyAddedMedia] = useState([]);
  const [currentAmazonMedia, setCurrentAmazonMedia] = useState([]);
  const [tags, setTags] = useState([]);
  const [status, setStatus] = useState("Published");
  const [loading, setLoading] = useState(false);
  const [amazonProductInfoLoading, setAmazonProductInfoLoading] =
    useState(false);

  const [amazonLoading, setAmazonLoading] = useState(false);
  const [error, setError] = useState(null);

  const [productLinks, setProductLinks] = useState([
    { id: Date.now(), link: "" },
  ]);

  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [fetchingProductId, setFetchingProductId] = useState(null);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  // const getQueryParams = () => {
  //   const searchParams = new URLSearchParams(location.search);
  //   return searchParams?.get("amazonLink");
  // };

  // useEffect(() => {
  //   const link = getQueryParams();
  //   if (link) {
  //     setAmazonLoading(true);
  //     setProductLink(link);
  //     fetchAmazonData(link); // Fetch data from backend
  //   }
  // }, []);

  const fetchAmazonData = async (link) => {
    try {
      const response = await axiosInstance.get(
        `/aws/fetch-aws-product?amazon_link=${encodeURIComponent(link)}`
      );
      const data = response.data;
      const values = {};
      values.itemName = data?.attributes?.item_name?.[0]?.value;
      values.description = data?.attributes?.bullet_point
        ?.map((item) => `• ${item.value}`)
        .join("\n");

      values.price = data?.price?.amount
      values.media = data?.images?.[0]?.images
        ?.filter((image) => image?.width >= 1000 && image?.height >= 1000)
        ?.map((urlLink, index) => {
          const ext = urlLink.link
            .substring(urlLink.link.lastIndexOf(".") + 1)
            .toLowerCase();
          return {
            id: index,
            url: urlLink.link,
            type: getTypeByExtension(ext),
            extension: ext,
          };
        });

      if (!values.media?.length) {
        values.media = data?.images?.[0]?.images?.map((item, index) => {
          const ext = item.link
            .substring(item.link.lastIndexOf(".") + 1)
            .toLowerCase();
          return {
            id: index,
            url: item.link,
            type: getTypeByExtension(ext),
            extension: ext,
          };
        });
      }

      setCurrentAmazonMedia(values.media.slice(0, 9));
      return {
        title: values?.itemName,
        description: values?.description,
        images: values?.media,
        price: values?.price
      };
    } catch (err) {
      console.log(err);
      message.error("Something went wrong while fetching product data.");
    } finally {
      setAmazonLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const warnings = [
      // {
      //   condition:
      //   (!productLink || (productLink && !validateAmazonLink(productLink))),
      //   message: "Please enter a valid product link",
      // },
      { condition: !generalInfo.name, message: "Please enter post name" },
      {
        condition: !generalInfo.description,
        message: "Please enter post description",
      },
      {
        condition: !manuallyAddedMedia.length,
        message: "Please upload atleast 1 media",
      },
    ];

    for (const { condition, message: warningMessage } of warnings) {
      if (condition) {
        message.warning(warningMessage);
        return;
      }
    }

    if (productLinks.length === 0 || products.length === 0) {
      message.error(
        "Please add at least one valid product link and ensure the product is added."
      );
      return;
    }

    const invalidLinks = productLinks.filter(
      ({ link }) => !validateAmazonLink(link) || !link.trim()
    );

    if (invalidLinks.length > 0) {
      message.error(
        `Invalid or empty links found. Please correct them before submitting.`
      );
      return;
    }

    const unusedLinks = productLinks.filter(
      ({ id }) => !products.some((_, index) => productLinks[index]?.id === id)
    );

    if (unusedLinks.length > 0) {
      setConfirmationMessage(`
        There is one or more links added but no data was fetched for them:
        Only added products will be saved. Do you want to continue?
      `);

      setConfirmationModalOpen(true);
      return;
    }
    handleFormSubmit();
  };

  const handleFormSubmit = async () => {
    setConfirmationModalOpen(false);
    const product_data = products.map((product, index) => ({
      ...product,
      link: productLinks[index]?.link || "",
    }));

    setLoading(true);
    const productData = {
      title: generalInfo.name,
      body: generalInfo.description,
      files: manuallyAddedMedia.length ? manuallyAddedMedia : [],
      status,
      tags,
    };

    const apiUrl = "/posts";
    const formData = new FormData();
    for (const key in productData) {
      if (key === "files") {
        for (const fileData of productData[key]) {
          formData.append(`files`, fileData.file);
        }
      } else {
        formData.append(key, productData[key]);
      }
    }

    // if (products) {
    //   products.forEach((item, index) => {
    //     formData.append(`productIds[${index}]`, item);
    //   });
    // }

    // if (isAmazonData) {
    //   affiliateLinkMedia.slice(0, 9).forEach((item, index) => {
    //     formData.append(`amazonMedia[${index}]`, item);
    //   });
    // }

    if (product_data) {
      product_data.forEach((product, productIndex) => {
        formData.append(`productData[${productIndex}][title]`, product.title);
        formData.append(
          `productData[${productIndex}][description]`,
          product.description
        );
        formData.append(`productData[${productIndex}][link]`, product.link);
        formData.append(`productData[${productIndex}][price]`, product.price)
        product.images.forEach((image, imageIndex) => {
          formData.append(
            `productData[${productIndex}][images][${imageIndex}]`,
            image.url
          );
        });
      });
    }

    try {
      await axiosInstance.post(apiUrl, formData);
      navigate("/dashboard/posts");
    } catch (error) {
      const defaultMessage = "Error adding post. Please try again later.";
      const apiMessage =
        error.response?.data?.message || "No additional details available.";
      setError(`${defaultMessage} ${apiMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setError(null);
  };

  const onAfiliateLinkMediaDelete = (index) => {
    if (currentAmazonMedia.length === 1) {
      message.warning("Atleast one media is required");
      return;
    }
    setCurrentAmazonMedia((prev) => prev.filter((_, idx) => idx !== index));

    setCurrentProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index),
    }));
  };

  const handleAddAnotherLink = () => {
    setProductLinks((prev) => [...prev, { id: Date.now(), link: "" }]);
  };

  const handleLinkChange = (id, value) => {
    setProductLinks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, link: value } : item))
    );
  };

  const handleFetchData = async (id) => {
    const productLink = productLinks.find((item) => item.id === id)?.link;
    if (!validateAmazonLink(productLink)) {
      message.warning("Please enter a valid Amazon product link.");
      return;
    }
    setIsModalOpen(true);
    setAmazonProductInfoLoading(true);
    setFetchingProductId(id);
    const fetchedData = await fetchAmazonData(productLink);
    setCurrentProduct(fetchedData);
    setAmazonProductInfoLoading(false);
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);

    setProducts(updatedProducts);

    setProductLinks((prev) => {
      if (prev.length === 1) {
        return prev.map((item, idx) =>
          idx === 0 ? { ...item, link: "" } : item
        );
      } else {
        return prev.filter((_, idx) => idx !== index);
      }
    });
  };

  const handleRemoveProductLink = (index) => {
    setProductLinks((prev) => {
      if (prev.length === 1) {
        return prev.map((item, idx) =>
          idx === 0 ? { ...item, link: "" } : item
        );
      } else {
        return prev.filter((_, idx) => idx !== index);
      }
    });

    if (productLinks[index].link != "") {
      const updatedProducts = [...products];
      updatedProducts.splice(index, 1);
      setProducts(updatedProducts);
    }
  };

  const handleAddProduct = () => {
    const updatedProduct = {
      ...currentProduct,
      images: currentAmazonMedia,
    };
    setProducts((prev) => [...prev, updatedProduct]);
    setCurrentProduct(null);
    setIsModalOpen(false);
  };

  return (
    <div className="add-post-container">
      <UBUBreadCrumb
        items={[
          { title: "Dashboard" },
          {
            title: <NavLink to="/dashboard/posts">Posts</NavLink>,
          },
          { title: "Create" },
        ]}
      />
      {error && (
        <Notification
          message={error}
          type="error"
          onClose={handleCloseNotification}
        />
      )}
      <div className="add-post-content">
        <div className="add-post-header">
          <Heading level={2} className="tw-font-vogue">
            Add Post
          </Heading>
          <CustomButton
            // className="cancel-button"
            onClick={() => navigate("/dashboard/posts")}
            variant={"light"}
          >
            Cancel
          </CustomButton>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="tw-grid lg:tw-grid-cols-[repeat(auto-fit,minmax(25rem,1fr))] tw-gap-5">
            <div className="">
              <div className="add_amazon_link tw-space-y-2 tw-mb-2">
                <Heading level={3} className="tw-font-manrope">
                  Amazon Link
                </Heading>
                {productLinks.map((item, index) => (
                  <div
                    key={item.id}
                    className="tw-flex tw-gap-4"
                    // style={{
                    //   display: "flex",
                    //   gap: "10px",
                    //   marginBottom: "10px",
                    // }}
                  >
                    <Input
                      placeholder="Enter Amazon product link"
                      value={item.link}
                      onChange={(e) =>
                        handleLinkChange(item.id, e.target.value)
                      }
                      style={{ flex: 1 }}
                    />
                    <Button
                      type="primary"
                      disabled={index == 0 && productLinks[0].link == ""}
                      onClick={() => handleRemoveProductLink(index)}
                    >
                      Remove
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => handleFetchData(item.id)}
                      disabled={!item.link.trim() || products[index]}
                    >
                      Fetch Data
                    </Button>
                  </div>
                ))}

                <Tooltip
                  title={
                    products.length == maxAllowedAffiliatedProducts &&
                    `You cannot upload more than ${maxAllowedAffiliatedProducts} affiliate products`
                  }
                >
                  <Button
                    disabled={
                      productLinks[productLinks.length - 1]?.link == "" ||
                      productLinks.length != products.length ||
                      products.length == maxAllowedAffiliatedProducts
                    }
                    type="dashed"
                    onClick={handleAddAnotherLink}
                  >
                    Add Another Link
                  </Button>
                </Tooltip>

                {/* <div className="input-group full-width">
                  {amazonLoading ? (
                    <Skeleton.Button block active size="large" />
                  ) : (
                    <div>
                      <div className='fetch-data-group'>
                        <input
                          className='fetch-data-input'
                          type="text"
                          name="amazonLink"
                          placeholder={`https://www.amazon.com/...`}
                          value={productLink}
                          onChange={handleAmazonLink}
                          required={true}
                        />
                        <Button onClick={handleFetchData} className='fetch-data-button'>Fetch Data</Button>
                      </div>
                      {linkError && <p className="link-error">{linkError}</p>}
                    </div>
                  )}
                </div> */}
              </div>
              <GeneralInformation
                isLoading={amazonLoading}
                generalInfo={generalInfo}
                setGeneralInfo={setGeneralInfo}
                parent={"Post"}
                required
              />

              {/* <ProductDropDown products={products} setProducts={setProducts} isLoading={amazonLoading} /> */}
              {
                // (isAmazonData || amazonLoading) ?
                //   <MediaPreview isLoading={amazonLoading} media={affiliateLinkMedia} onMediaDelete={onAfiliateLinkMediaDelete} manuallyAddedMedia={manuallyAddedMedia} setManuallyAddedMedia={setManuallyAddedMedia} optionalTitle={'Affiliate Media Preview'} />
                // :
                <Media
                  media={manuallyAddedMedia}
                  setMedia={setManuallyAddedMedia}
                  mediaLimit={5}
                />
              }

              {products.length > 0 && (
                <AddedProductsListing
                  products={products}
                  handleRemoveProduct={handleRemoveProduct}
                />
              )}
            </div>
            <div className="">
              <Tags isLoading={amazonLoading} tags={tags} setTags={setTags} />
              <Status
                isLoading={amazonLoading}
                status={status}
                setStatus={setStatus}
                parent={"Post"}
              />

              {/* <ProductLink
                disabled={isAmazonData}
                productLink={productLink}
                setProductLink={setProductLink}
                isLoading={amazonLoading}
              /> */}
            </div>
          </div>

          {!amazonLoading && (
            <div className="submit-button-container">
              <CustomButton
                type="submit"
                onClick={handleSubmit}
                loading={loading}
                className="submit-button"
                variant={"black"}
              >
                Submit
              </CustomButton>
            </div>
          )}
        </form>
      </div>

      <Modal
        width={"50%"}
        title="Amazon Product Information"
        open={isModalOpen}
        onOk={handleAddProduct}
        onCancel={() => setIsModalOpen(false)}
        okText="Add Product"
        okButtonProps={{ disabled: amazonProductInfoLoading }}
        cancelText="Cancel"
      >
        <AmazonProductInformation
          media={currentAmazonMedia}
          setMedia={setCurrentAmazonMedia}
          currentProduct={currentProduct}
          informationLoading={amazonProductInfoLoading}
          onAfiliateLinkMediaDelete={onAfiliateLinkMediaDelete}
        />
      </Modal>

      {isConfirmationModalOpen && (
        <ConfirmationModal
          onClose={() => setConfirmationModalOpen(false)}
          message={confirmationMessage}
          onConfirm={handleFormSubmit}
          isConfirmLoading={false}
        />
      )}
    </div>
  );
};

export default AddPostNew;
