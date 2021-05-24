import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";
import AuthService from "./../../services/auth.service";

function AdminNavbar(props) {
  const admin = AuthService.getUser();
  const [adminName, setAdminName] = useState(admin.name);
  const [brandText, setBrandText] = useState(props.brandText);
  useEffect(() => {
    setBrandText(props.brandText);
    if (!admin) {
      props.history.push("/auth/login");
    }
  }, [props.brandText]);

  const logout = () => {
    AuthService.logout();
    props.history.push("/auth/login");
  };

  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/"
          >
            {brandText}
          </Link>
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm bg-white rounded-circle">
                    <img
                      style={{ width: "80%" }}
                      alt="..."
                      src={require("assets/img/theme/helmet.png")}
                    />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                      {adminName}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Salut!</h6>
                </DropdownItem>
                {/* <DropdownItem to="/profile" tag={Link}>
                    <i className="ni ni-single-02" />
                    <span>Gestion Profil</span>
                  </DropdownItem> */}
                <DropdownItem divider />
                <DropdownItem onClick={logout}>
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default AdminNavbar;
