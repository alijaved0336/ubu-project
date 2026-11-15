import Tags from "@src/components/Tags/Tags";
import GeneralInformation from "@src/components/GeneralInformation/GeneralInformation";
import "../CreateWhatsNew/CreateWhatsNew.less";

import { Button } from "antd";
import { useWhatsNew } from "@src/components/Providers/WhatsNewProvider";

const EditWhatsNewForm = () => {
  const {
    navigate,
    generalInfo,
    setGeneralInfo,
    tags,
    setTags,
    isEditing,
    handleEditWhatsNew,
    isFetchingSingleWhatsNew,
  } = useWhatsNew();

  return (
    <div className="add-whats-new-content">
      <div className="add-whats-new-header">
        <h1>Add New Feature</h1>
        <button
          className="cancel-button"
          onClick={() => navigate("/dashboard/whats_new")}
        >
          Cancel
        </button>
      </div>
      <form>
        <div className="form-content">
          <div className="left-section">
            <GeneralInformation
              isLoading={isFetchingSingleWhatsNew}
              generalInfo={generalInfo}
              setGeneralInfo={setGeneralInfo}
              parent={"Feature"}
              required
            />
          </div>
          <div className="right-section">
            <Tags
              isLoading={isFetchingSingleWhatsNew}
              tagType="object"
              tagLimit={1}
              tags={tags}
              setTags={setTags}
            />
          </div>
        </div>
        <div className="submit-button-container">
          {!isFetchingSingleWhatsNew && (
            <Button
              loading={isEditing}
              type="submit"
              onClick={handleEditWhatsNew}
              className="submit-button"
            >
              Submit
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EditWhatsNewForm;
