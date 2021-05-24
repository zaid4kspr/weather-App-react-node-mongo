import React from "react";

// reactstrap components
import { NavItem, NavLink, Nav, Container, Row, Col } from "reactstrap";

class Login extends React.Component {
  render() {
    return (
      <>
        <footer className="py-5">
          <Container>
            <Row className="align-items-center justify-content-xl-between">
              <Col xl="12">
                <div className="copyright text-center text-lg-right text-muted text-white">
                  © 2021{" "}
                  <a
                    className="font-weight-bold ml-1 text-white"
                    href="https://www.google.tn/"
                    target="_blank"
                  >
                    Priviledger
                  </a>
                </div>
              </Col>
            </Row>
          </Container>
        </footer>
      </>
    );
  }
}

export default Login;
