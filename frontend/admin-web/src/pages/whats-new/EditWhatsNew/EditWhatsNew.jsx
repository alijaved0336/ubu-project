import EditWhatsNewForm from "./EditWhatsNewForm";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";
import WhatsNewProvider from "@src/components/Providers/WhatsNewProvider";
import "../CreateWhatsNew/CreateWhatsNew.less";

import { NavLink } from "react-router-dom";

const EditWhatsNew = () => {
  return (
    <WhatsNewProvider>
      <div className="add-whats-new-container">
        <UBUBreadCrumb
          items={[
            { title: "Dashboard" },
            {
              title: <NavLink to="/dashboard/whats_new">Whats New</NavLink>,
            },
            { title: "Edit" },
          ]}
        />
        <EditWhatsNewForm />
      </div>
    </WhatsNewProvider>
  );
};

export default EditWhatsNew;
