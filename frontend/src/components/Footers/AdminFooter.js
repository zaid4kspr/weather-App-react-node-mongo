import React from "react";

// reactstrap components
import { Container, Row, Col, Nav, NavItem, NavLink } from "reactstrap";

class Footer extends React.Component {
  render() {
    return (
      <footer className="footer">
        <Row className="align-items-center justify-content-xl-between">
          <Col xl="12">
            <div className="copyright text-center text-lg-right text-muted">
              © 2021{" "}
              <a
                className="font-weight-bold ml-1"
                href="https://www.google.tn/"
                rel="noopener noreferrer"
                target="_blank"
              >
                Priviledger
              </a>
            </div>
          </Col>
        </Row>
      </footer>
    );
  }
}

export default Footer;
