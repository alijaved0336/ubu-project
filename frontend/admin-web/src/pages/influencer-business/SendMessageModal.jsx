import  { useEffect, useState } from "react";
import { List } from "antd";
import axiosInstance from "../../application-wide/axios/axios-instance";
import { useNavigate } from "react-router-dom";
import { UBUSearch } from "@src/components";
import { SearchOutlined } from "@ant-design/icons";
import CustomModal from "@src/components/Modals/CustomModal";
import { Heading } from "@src/components/Common/Typography";
import PropTypes from "prop-types";
import useChatEvents from "@src/application-wide/api-gateway-hooks/use-chat-events";


const SendMessageModal = ({ isModalOpen, setIsModalOpen, brandId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {sendMessage} = useChatEvents()
  // Fetch data when modal is opened
  useEffect(() => {
    if (isModalOpen) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await axiosInstance.get("/proposals"); // Replace with your backend endpoint
          setData(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [isModalOpen]);

  // Handle search input change and send search request to backend
  const handleSearch = async (value) => {
    setLoading(true);
    try {
      const params = { query: value };
      const response = await axiosInstance.post("/proposals/search", params);
      setData(response.data);
    } catch (error) {
      console.error("Error searching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle clicking on a list item
  const handleItemClick = (item) => {
    sendMessage(
      null, //user object of sender
      null, //user object of reciever
      item?.body, //message
      null, //file_name
      null, //file_url
      brandId, //brandId
      item?.influencerId,
      "influencer"
    );
    navigate(`/dashboard/chats`);
  };

  return (
    <CustomModal
      title={
        <Heading level={2} className="tw-font-manrope">
          Search Data
        </Heading>
      }
      isOpen={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
      width={600}
    >
      <UBUSearch
        prefix={<SearchOutlined width={"16px"} height={"16px"} />}
        placeholder="Search..."
        onSearch={handleSearch}
        // className="search-bar"
        enterButton
      />

      {!loading && data.length == 0 ? (
        <p style={{ textAlign: "center", marginTop: "10px", color: "gray" }}>
          There are no proposals. Please create first to send message to brand.
        </p>
      ) : (
        <div>
          <List
            loading={loading}
            bordered
            dataSource={data.slice(0, 5)} // Limit to maximum 5 items
            renderItem={(item) => (
              <List.Item
                onClick={() => handleItemClick(item)}
                style={{ cursor: "pointer" }}
              >
                {item.name}
              </List.Item>
            )}
          />

          {data.length > 5 && (
            <p
              style={{ textAlign: "center", marginTop: "10px", color: "gray" }}
            >
              You can search more to get the desired data.
            </p>
          )}
        </div>
      )}
    </CustomModal>
  );
};

SendMessageModal.propTypes = {
  setIsModalOpen : PropTypes.func,
  isModalOpen:PropTypes.bool,
  brandId:PropTypes.number
}
export default SendMessageModal;
