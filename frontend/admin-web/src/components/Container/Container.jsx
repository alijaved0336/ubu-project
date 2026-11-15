import propTypes from "prop-types";

function Container({ children, overflow = "intial", style }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1440px",
        margin: "0 auto",
        overflow,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

Container.propTypes = {
  children: propTypes.node,
  overflow: propTypes.string,
  style: propTypes.object,
};

export default Container;
