import ProductDropDown from "./ProductDropDown";
import Tags from "../../../components/Tags/Tags";
import Media from "../../../components/Media/Media";
import Status from "../../../components/Status/Status";
import Notification from "../../../components/Notification";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";
import axiosInstance from "../../../application-wide/axios/axios-instance";
import GeneralInformation from "../../../components/GeneralInformation/GeneralInformation";
import "./AddPostNew.less";

import { Button, Input, message, Modal, Skeleton, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { getTypeByExtension } from "@src/utils/helpers";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { validateAmazonLink, validateShortAmazonLink } from "@src/utils/regex";
import AddedProductsListing from "./AddedProductsListing";
import AmazonProductInformation from "./AmazonProductInformation";
import ConfirmationModal from "@src/components/ConfirmationModal/ConfirmationModal";
import { maxAllowedAffiliatedProducts } from "@src/utils/constant";

const EditPostNew = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [generalInfo, setGeneralInfo] = useState({ name: "", description: "" });
  const [media, setMedia] = useState([]);
  const [tags, setTags] = useState([]);
  const [affiliateLinkMedia, setAffliliateLinkMedia] = useState([]);
  const [currentAmazonMedia, setCurrentAmazonMedia] = useState([]);

  const [productLink, setProductLink] = useState(null);
  const [status, setStatus] = useState("Draft");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [amazonLoading, setAmazonLoading] = useState(false);
  const [isAmazonData, setIsAmazonData] = useState(false);

  const [productLinks, setProductLinks] = useState([
    { id: Date.now(), link: "", isDisabled: false },
  ]);

  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [fetchingProductId, setFetchingProductId] = useState(null);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [amazonProductInfoLoading, setAmazonProductInfoLoading] =
    useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    // Fetch product options from the backend
    const fetchPostData = async () => {
      try {
        const response = await axiosInstance.get(`posts/${id}`); // Adjust the endpoint as needed
        const data = response.data;
        if (isMounted) {
          setGeneralInfo({ name: data.title, description: data.body });
          setMedia(
            data.media.map((item, index) => ({
              ...item,
              id: index + 1,
            }))
          );
          setStatus(data.status);
          setTags(data.tags ?? []);
          const updatedProductData = data?.affiliateProducts.map((product) => ({
            ...product,
            images: product.images.map((image) => ({
              id: Date.now(),
              url: image,
            })),
          }));

          setProducts(updatedProductData ?? []);
          const productLinks = data.affiliateProducts?.map((item) => ({
            isDisabled: true,
            id: Date.now(),
            link: item.link,
          }));
          setProductLinks(productLinks);
        }
      } catch (error) {
        console.error("Error fetching product options:", error);
        setError("Error fetching post data. Please try again later.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPostData();
    return () => {
      isMounted = false;
    };
  }, []);

  const onAfiliateLinkMediaDelete = (index) => {
    // setAffliliateLinkMedia((prevMedia) =>
    //   prevMedia.filter((_, i) => i !== index)
    // );

    setCurrentAmazonMedia((prev) => prev.filter((_, idx) => idx !== index));

    setCurrentProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index),
    }));
  };

  const handleAddAnotherLink = () => {
    setProductLinks((prev) => [
      ...prev,
      { id: Date.now(), link: "", isDisabled: false },
    ]);
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

      setCurrentAmazonMedia(values.media || []);
      return {
        title: values?.itemName,
        description: values?.description,
        images: values?.media,
      };
    } catch (err) {
      console.log(err);
      message.error("Something went wrong while fetching product data.");
    } finally {
      setAmazonLoading(false);
    }
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);

    setProducts(updatedProducts);

    setProductLinks((prev) => {
      if (prev.length === 1) {
        return prev.map((item, idx) =>
          idx === 0 ? { ...item, link: "", isDisabled: false } : item
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
          idx === 0 ? { ...item, link: "", isDisabled: false } : item
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const warnings = [
      { condition: !generalInfo.name, message: "Please enter post name" },
      {
        condition: !generalInfo.description,
        message: "Please enter post description",
      },
      {
        condition: !media.length,
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

  const handleCloseNotification = () => {
    setError(null);
  };

  const handleFormSubmit = async () => {
    setConfirmationModalOpen(false);
    const product_data = products.map((product, index) => ({
      ...product,
      link: productLinks[index]?.link || "",
    }));

    setIsSubmitting(true);
    const productData = {
      title: generalInfo.name,
      body: generalInfo.description,
      files: media,
      status,
      tags,
    };

    const formData = new FormData();
    for (const key in productData) {
      if (key === "files") {
        for (const [index, fileData] of productData[key].entries()) {
          if (fileData.file) {
            formData.append(`files`, fileData.file);
          } else {
            formData.append(`urls[${index}][url]`, fileData.url);
            formData.append(`urls[${index}][type]`, fileData.type);
            formData.append(`urls[${index}][extension]`, fileData.extension);
            formData.append(`urls[${index}][size]`, fileData.size);
            formData.append(`urls[${index}][locationIndex]`, index);
            formData.append(
              `urls[${index}][placeholder]`,
              fileData.placeholder
            );
            formData.append(`urls[${index}][width]`, fileData.width);
            formData.append(`urls[${index}][height]`, fileData.height);
            formData.append(
              `urls[${index}][aspectRatio]`,
              fileData.aspectRatio
            );
          }
        }
      } else {
        formData.append(key, productData[key]);
      }
    }

    if (product_data) {
      product_data.forEach((product, productIndex) => {
        if (product.id)
          formData.append(`productData[${productIndex}][id]`, product.id);
        formData.append(`productData[${productIndex}][title]`, product.title);
        formData.append(
          `productData[${productIndex}][description]`,
          product.description
        );
        formData.append(`productData[${productIndex}][link]`, product.link);

        product.images.forEach((image, imageIndex) => {
          formData.append(
            `productData[${productIndex}][images][${imageIndex}]`,
            image.url
          );
        });
      });
    }

    // if (products) {
    //   products.forEach((item, index) => {
    //     formData.append(`productIds[${index}]`, item);
    //   });
    // }

    try {
      await axiosInstance.put(
        `posts/${id}?requestFrom=webApplication`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      navigate("/dashboard/posts"); // Navigate back to products list
    } catch (error) {
      console.error("Error editing post:", error);
      setError("Something went wrong. Please try again later.", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-post-container">
      <UBUBreadCrumb
        items={[
          { title: "Dashboard" },
          {
            title: <NavLink to="/dashboard/posts">Posts</NavLink>,
          },
          { title: "Edit" },
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
          <h1>Edit Post</h1>
          <button
            className="cancel-button"
            onClick={() => navigate("/dashboard/posts")}
          >
            Cancel
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-content">
            <div className="left-section">
              <div className="add_amazon_link">
                <h2>Amazon Link</h2>

                {productLinks.map((item, index) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    {loading ? (
                      <Skeleton.Button block active size="medium" />
                    ) : (
                      <Input
                        placeholder="Enter Amazon product link"
                        value={item.link}
                        onChange={(e) =>
                          handleLinkChange(item.id, e.target.value)
                        }
                        disabled={item.isDisabled}
                        style={{ flex: 1 }}
                      />
                    )}
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
                      productLinks.length != products.length
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
                isLoading={loading}
                generalInfo={generalInfo}
                setGeneralInfo={setGeneralInfo}
                parent={"Post"}
                required
              />
              {/* <ProductDropDown
                isLoading={loading}
                products={products}
                setProducts={setProducts}
              /> */}
              <Media isLoading={loading} media={media} setMedia={setMedia} />
              {products.length > 0 && (
                <AddedProductsListing
                  products={products}
                  handleRemoveProduct={handleRemoveProduct}
                />
              )}
            </div>
            <div className="right-section">
              <Tags isLoading={loading} tags={tags} setTags={setTags} />
              <Status
                isLoading={loading}
                status={status}
                setStatus={setStatus}
                parent={"Post"}
              />
            </div>
          </div>
          {!loading && (
            <div className="submit-button-container">
              <Button
                onClick={handleSubmit}
                loading={isSubmitting}
                className="submit-button"
              >
                Submit
              </Button>
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

export default EditPostNew;
