import { useState, useEffect } from "react";

const useDetectScreenSize = (width) => {
  const [isScreenSmall, setIsScreenSmall] = useState(
    window.innerWidth <= width
  );

  useEffect(() => {
    const handleResize = () => {
      setIsScreenSmall(window.innerWidth <= width);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [width]);

  return isScreenSmall;
};

export default useDetectScreenSize;
