import { useState, useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import "./PublishCampaign.less";
import { Input, Tag, message } from "antd";
import axiosInstance from "@src/application-wide/axios/axios-instance";
import UploadMedia from "@src/components/Campaign/UploadMedia";
import SocialMediaSelector from "@src/components/Campaign/SocialMediaSelector";
import CampaignPublishSkeleton from "@src/components/Skeletons/PublishCampaignPageSkeleton";
import { Alert, Modal } from "antd";
import {
  ExclamationCircleOutlined,
  InstagramOutlined,
} from "@ant-design/icons";
import { CustomButton, UBUModal } from "@src/components";
import EditableTextArea from "@src/components/EditableTextArea";
import InstagramPost from "@src/components/InstagramPost/InstagramPost";
import { useGetUserQuery } from "@src/store/api/userApi";
import MediaPreview from "@src/components/Campaign/MediaPreview";

import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";
import CustomModal from "@src/components/Modals/CustomModal";
import { Heading, Paragraph } from "@src/components/Common/Typography";

const PublishCampaign = () => {
  const { user } = useGetUserQuery(undefined, {
    selectFromResult: ({ data, isLoading, isFetching }) => ({
      user: data ?? {},
      loading: isLoading || isFetching,
    }),
  });
  const { id } = useParams();
  const [campaignData, setCampaignData] = useState(null);
  const [campaign, setCampaign] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isPreviewModalOpen, setPreviewModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [hashtags, setHashtags] = useState([]);
  const [currentExhibitId, setCurrentExhibitId] = useState(null);
  const navigate = useNavigate();
  const [media, setMedia] = useState([]);
  const [isAmazonData, setIsAmazonData] = useState(false);
  const [amazonData, setAmazonData] = useState({});
  const [error, setError] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [localMedia, setLocalMedia] = useState([]);
  const [description, setDescription] = useState("");
  const [manualUploadIndex, setManualUploadIndex] = useState();
  const [isImagesUploading, setImagesUploading] = useState(false);
  const [isModalAccessible, setIsModalAccessible] = useState(false);


  useEffect(() => {
    const fetchCampaignData = async () => {
      setLoading(true);

      try {
        const response = await axiosInstance.get(
          `/aws/fetch-product-detail?campaign_id=${id}`
        );

        const data = response.data?.document;
        const separatedValues =
          data?.hashtags.flatMap((item) =>
            item.split(",").map((value) => value.trim())
          ) ?? [];
        if (separatedValues) {
          data.hashtags = separatedValues;
        }
        setHashtags(data?.hashtags);
        const amazonData = response.data?.amazonProductInfo;
        if (amazonData) {
          const values = amazonData;
          values.itemName = amazonData?.attributes?.item_name?.[0]?.value;
          values.description = amazonData?.attributes?.bullet_point
            ?.map((item) => `• ${item.value}`)
            .join("\n");
          if (values.description) {
            setDescription(values.description);
          }
          values.price =
            amazonData?.attributes?.list_price?.[0]?.value +
            " " +
            amazonData?.attributes?.list_price?.[0]?.currency;
          values.color = amazonData?.attributes?.color
            ?.map((item) => `${item.value}`)
            .join(", ");
          setAmazonData(values);
        }

        if (amazonData?.attributes?.item_name?.[0]?.value) {
          setIsAmazonData(true);
          setMedia(
          amazonData?.images?.[0]?.images
            ?.filter((image) => image?.width >= 1000 && image?.height >= 1000)
            ?.map((image, index) => ({
              url: image?.link,
              id: index
            }))
          )
        }
        setCampaignData(data);
        setCampaign(response.data.campaign);
        setCurrentExhibitId(data.id);
      } catch (error) {
        if (
          error?.response?.data?.message?.includes("authenticate with Amazon")
        ) {
          message.error("Please contact Brand to authenticate with amazon.");

          setTimeout(() => {
            navigate(`/dashboard/campaigns/${id}`);
          }, 2000);
        } else {
          message.error("Error fetching campaign data:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    let isMounted = true;

    if (isMounted) {
      fetchCampaignData();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  if (!campaign) {
    return (
      <div className="campaign-container">
        <CampaignPublishSkeleton />
      </div>
    );
  }
  const uploadManualMedia = async () => {
    try {
      if (!localMedia || localMedia.length === 0) {
        message.error("No local media to upload.");
        return [];
      }

      setImagesUploading(true);

      // Prepare formData for multiple files
      const formData = new FormData();
      media.forEach((media) => {
        if (media.file){
          formData.append("files", media.file); 
        }
      });
      formData.append("folderName", "products_new");

      // Axios call for uploading files
      const response = await axiosInstance.post("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data && response.data.urls) {
        const uploadedUrls = response.data.urls.map((item) => item.url);
        console.log("Uploaded Files URLs:", uploadedUrls);
        let urlIndex = 0;
        const updatedMediaArray = media.map(item => {
          if (item.url.includes('blob') && urlIndex < uploadedUrls.length) {
            return {
              ...item,
              url: uploadedUrls[urlIndex++]
            };
          }
          return item;
        });
          const urlsArray = updatedMediaArray.map(item => item.url);
 
        // message.success("Media uploaded successfully.");
        return urlsArray; // Return the URLs for further processing
      } else {
        message.error("Upload Failed: no URLs returned from the server.");
        return [];
      }
    } catch (error) {
      console.error("Error uploading media:", error);
      message.error("Error uploading media. Please try again.");
      return [];
    } finally {
      setImagesUploading(false);
    }
  };

  const handleDescriptionChange = (updatedValue) => {
    setDescription(updatedValue);
  };
  const handleUpload = (event) => {
    if (media.length < 9) {
      if (!manualUploadIndex) {
        setManualUploadIndex(media.length);
      }
      const files = Array.from(event.target.files);
      let maxId = media.reduce((max, item) => Math.max(max, item.id), 0) + 1;
          const uploadedImages = files.map((file) => ({
            url: URL.createObjectURL(file),
            id: maxId++,
            file
          }));
      setMedia((prevMedia) => [...prevMedia, ...uploadedImages]);

      // if (!isAmazonData) {
      const newMedia = files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
        type: file.type.split("/")[0],
        extension: file.name.split(".").pop(),
      }));
      setLocalMedia([...localMedia, ...newMedia]);
      // }
    } else {
      message.error("You cannot upload more than 9 media items");
    }
  };

  const handleRemoveMedia = (index) => {
    if (manualUploadIndex && manualUploadIndex > index) {
      setManualUploadIndex(manualUploadIndex - 1);
    } else if (manualUploadIndex && manualUploadIndex === index) {
      if (media.length === manualUploadIndex) {
        setManualUploadIndex(null);
      }
    }
    setMedia((prevMedia) => prevMedia.filter((_, i) => i !== index));
    if (!isAmazonData) {
      setLocalMedia((prevMedia) => prevMedia.filter((_, i) => i !== index));
    }
  };

  const handleClearMedia = () => setMedia([]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async () => {
    // showing a modal--> to publish a post you first need to connect to instagram
    // showing this modal to every user as our meta app is not approved yet and this is temporary.
    
    // setIsModalAccessible(true);
    
    setButtonLoading(true);
    let publishData = {};
    const formData = new FormData();

    let mediaUrls = media.slice(0, manualUploadIndex || 9);
    // Upload local media if needed
    if (isAmazonData && localMedia.length > 0) {
      const uploadedUrls = await uploadManualMedia();
      mediaUrls = [...uploadedUrls];
    }
    if (isAmazonData) {
      publishData = {
        url: campaignData?.advertisemntUrl,
        media: mediaUrls,
        description: description,
        is_amazon_data: isAmazonData,
        brand_id: campaign.brand.id,
        campaign_id: campaign.id,
      };
      publishData.description = description;
    } else {
      setError(false);
      console.log(localMedia, "localMedia");
      publishData = {
        url: null,
        media: localMedia,
        description: description,
        is_amazon_data: isAmazonData,
        brand_id: campaign.brand.id,
        campaign_id: campaign.id,
      };

      publishData.description = description;

      for (const key in publishData) {
        if (!["media"].includes(key)) {
          formData.append(key, publishData[key]);
        }
      }

      publishData.media.forEach((fileData, index) => {
        formData.append(`media`, fileData.file); // Remove index for multiple files
      });
    }
    try {
      
      if (isAmazonData) {
        const response = await axiosInstance.post(
          "/aws/amazon_publish",
          publishData
        );
        if(response.data.message ==="No instagram credentials for this user.")
        {
          setIsModalAccessible(true)
        }
        else 
        {
          message.success(
            "Please wait. We will notify you when the content is published."
          );
    
          setTimeout(() => {
            navigate(`/dashboard/campaigns/${id}`);
          }, 2000);
        }
      } else {
        const response = await axiosInstance.post(
          "/aws/local_publish/instagram",
          formData
        );
        if(response.data.message ==="No instagram credentials for this user.")
        {
          setIsModalAccessible(true)
        }
        else 
        {
          message.success(
            "Please wait. We will notify you when the content is published."
          );
    
          setTimeout(() => {
            navigate(`/dashboard/campaigns/${id}`);
          }, 2000);
        }
      }

     
    } catch (error) {
      message.error(
        "Error submitting campaign: " + (error?.response?.data?.message || error)
      );
    } finally {
      setButtonLoading(false);
    }
  };

  
  return (
    <div className="main-publish-container">
      <UBUBreadCrumb
        items={[
          { title: "Dashboard" },
          {
            title: <NavLink to={"/dashboard/campaign"}>Campaigns</NavLink>,
          },
          { title: "Publish" },
        ]}
      />
        <div>
      {/* Button to toggle modal accessibility */}
      
      {isModalAccessible && (
       <CustomModal
       title={
         <Heading level={4}>
           Instagram Not Connected
         </Heading>
       }
       width="672px"
       isOpen={true}
       className="!tw-h-auto"
       onCancel={() => setIsModalAccessible(false)} // Close modal on cancel
       centered
       bodyWrapperClassName="tw-p-4"
       footer={null}
     >
       <Paragraph>
         Your Instagram account is not connected. This functionality requires an active Instagram connection to proceed. Please connect your Instagram account to continue using this feature.
       </Paragraph>
     </CustomModal>
      )}
    </div>
      <div className="warning-message">
        <Alert
          message="At this time, your campaign post will be published on Instagram only. We're working to add more platforms soon!"
          type="warning"
          showIcon
          icon={<ExclamationCircleOutlined />}
          style={{
            marginBottom: "16px",
            fontSize: "14px",
            fontFamily: "Manrope",
          }}
        />
      </div>
      <div className="top-bar">
        <h2>Post Details</h2>
        <div className="publish-button-group">
          <CustomButton
            type="primary"
            variant={"light"}
            className="publish-post-back-button"
            onClick={() => handleBack()}
          >
            Back
          </CustomButton>
          <CustomButton
            type="primary"
            className="insta-preview-post-button"
            variant={"light"}
            onClick={(event) => {
              event.stopPropagation();
              setPreviewModalOpen(true);
            }}
          >
            <InstagramOutlined
              style={{
                gap: 2,
                fontSize: 20,
                color: "#E1306C",
              }}
            />{" "}
            Preview
          </CustomButton>

          <CustomButton
            type="primary"
            className="publish-button"
            loading={buttonLoading || isImagesUploading}
            onClick={() => handleSubmit()}
            disabled={!media || media.length === 0 || !description}
          >
            Publish
          </CustomButton>
        </div>
      </div>
      <div className="campaign-container">
        <div className="campaign-left">
          <div className="campaign-content">
            {isAmazonData && (
              <div className="campaign-field">
                <label>Title</label>
                <Input
                  value={amazonData.itemName}
                  readOnly
                  className="input-field"
                />
              </div>
            )}

            <div className="campaign-field">
              <label>Post Description</label>
              <EditableTextArea
                initialValue={isAmazonData && amazonData?.description}
                placeholder="Enter your post description"
                onChange={handleDescriptionChange}
              />
            </div>

            <div className="campaign-field">
              <label>Tags</label>
              <div className="tags-container">
                {campaignData?.hashtags.map((tag) => (
                  <Tag key={tag} className="tag">
                    #{tag}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="campaign-right">
          {<UploadMedia onUpload={handleUpload} />}
          <MediaPreview setMedia={setMedia} media={media} onMediaDelete={handleRemoveMedia} />
          <SocialMediaSelector onClear={handleClearMedia} />
        </div>
      </div>

      <Modal
        title="Instagram Post"
        footer={null}
        open={isPreviewModalOpen}
        onCancel={() => {
          setPreviewModalOpen(false);
        }}
        width={"450px"}
      >
        <InstagramPost
          ProfilePicture={user?.avatar}
          title={`${user?.first_name} ${user?.last_name}`}
          image={media[0]}
          className="tw-shadow-xl"
          description={`${description} ${
            hashtags.length > 0
              ? "\n\n" + hashtags.map((tag) => `#${tag}`).join(" ")
              : ""
          }`}
        />
      </Modal>
    </div>
  );
};

export default PublishCampaign;
