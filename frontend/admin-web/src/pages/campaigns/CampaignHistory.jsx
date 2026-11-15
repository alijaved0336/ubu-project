import PropTypes from "prop-types";
import axiosInstance from "../../application-wide/axios/axios-instance";
import SmallLoader from "../../components/SmallLoader";
import "./CampaignHistory.less";

import { useState, useEffect } from "react";
import { formattedAmount } from "@src/utils/helpers";

const CampaignHistory = ({
  campaignId,
  currentExhibitId,
  fetchNewExhibitDocument,
}) => {
  const [loading, setLoading] = useState(false);
  const [exhibitDocuments, setExhibitDocuments] = useState([]);

  useEffect(() => {
    const fetchCampaignData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.post(
          `/exhibit_document/${campaignId}/getHistoryData`,
          { except_id: currentExhibitId }
        );
        setExhibitDocuments(response.data);
      } catch (error) {
        console.error("Error fetching segment data:", error);
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
  }, [campaignId, currentExhibitId]);

  return (
    <div className="campaign-index-container">
      <div className="campaign-index-table">
        {loading ? (
          <SmallLoader />
        ) : exhibitDocuments.length == 0 ? (
          <span className="no-records">
            There are no changes for this campaign
          </span>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Submission Date</th>
                <th>Publication Date</th>
                <th>Total Compensation</th>
                <th>No of Deliverables</th>
                <th>Document Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exhibitDocuments.map((exhibitDocument, index) => (
                <tr key={index}>
                  <td>{exhibitDocument.draftSubmissionDate}</td>
                  <td>{exhibitDocument.publicationDates}</td>
                  <td>{formattedAmount(exhibitDocument.totalCompensation)}</td>
                  <td>
                    {exhibitDocument?.numberOfDeliverables?.length ? (
                      <ul>
                        {exhibitDocument.numberOfDeliverables.map(
                          (deliverable, index) => (
                            <li key={index}>
                              <span>{deliverable.type}</span>:{" "}
                              {deliverable.count}
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p>No deliverables available</p>
                    )}
                  </td>
                  <td>{exhibitDocument.documentOrder}</td>
                  <td className="actions">
                    <i
                      className="fas fa-eye"
                      onClick={() =>
                        fetchNewExhibitDocument(exhibitDocument.id)
                      }
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

CampaignHistory.propTypes = {
  campaignId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  currentExhibitId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fetchNewExhibitDocument: PropTypes.func,
};

export default CampaignHistory;
