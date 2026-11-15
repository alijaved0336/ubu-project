import React, { useLayoutEffect, useState } from "react";

const useScrollableElement = () => {
  const [scrollContainer, setScrollContainer] = useState(null);

  useLayoutEffect(() => {
    const main = document.getElementById("dashoard-main");
    setScrollContainer(main);
  }, []);

  return { scrollContainer };
};

export default useScrollableElement;
