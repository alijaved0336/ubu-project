import CreateWhatsNewForm from "./CreateWhatsNewForm";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";
import WhatsNewProvider from "@src/components/Providers/WhatsNewProvider";
import "./CreateWhatsNew.less";

import { NavLink } from "react-router-dom";

const CreateWhatsNew = () => {
  return (
    <WhatsNewProvider>
      <div className="add-whats-new-container">
        <UBUBreadCrumb
          items={[
            { title: "Dashboard" },
            {
              title: <NavLink to="/dashboard/whats_new">Whats New</NavLink>,
            },
            { title: "Create" },
          ]}
        />
        <CreateWhatsNewForm />
      </div>
    </WhatsNewProvider>
  );
};

export default CreateWhatsNew;
