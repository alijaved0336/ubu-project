import { Breadcrumb } from "antd";

import PropTypes from "prop-types";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

const UBUBreadCrumb = ({ items }) => {
  const [portalRoot, setPortalRoot] = useState(null);

  useEffect(() => {
    const root = document.getElementById("bread-crumb");
    if (!root) {
      console.error("Portal root 'bread-crumb' not found in the DOM.");
      return;
    }

    setPortalRoot(root);
  }, []);

  if (!portalRoot) return null;

  return createPortal(
    <Breadcrumb items={items} className="tw-font-manrope tw-text-sm" />,
    portalRoot
  );
};

UBUBreadCrumb.propTypes = {
  items: PropTypes.array,
  override: PropTypes.bool,
};
export default UBUBreadCrumb;
