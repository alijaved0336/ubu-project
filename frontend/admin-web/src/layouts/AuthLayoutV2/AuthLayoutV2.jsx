import { Container } from "@src/components";
import { Col, Flex, Row } from "antd";
import propTypes from "prop-types";

import "./AuthLayoutV2.less";

import authPageCircle1 from "@src/assets/images/autpagecircle1.png";
import authPageCircle2 from "@src/assets/images/authpagecirlce2.png";

function AuthLayoutV2({ children }) {
  return (
    <Row className="AuthLayoutV2" wrap="nowrap">
      <Col className="col col-1">
        <Flex align="end">
          <img className="left-img" src={authPageCircle1} />
        </Flex>
      </Col>
      <Col className="col col-2">
        <Container style={{ display: "flex", justifyContent: "center" }}>
          {children}
        </Container>
      </Col>
      <Col className="col col-3">
        <Flex align="start">
          <img className="left-img" src={authPageCircle2} />
        </Flex>
      </Col>
    </Row>
  );
}

AuthLayoutV2.propTypes = {
  children: propTypes.node,
};

export default AuthLayoutV2;
