import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import Index from "components/Dashboard/index.js";
import AuthService from "services/auth.service.js";

import routes from "routes.js";

class Admin extends React.Component {
  componentDidUpdate(e) {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.mainContent.scrollTop = 0;
  }
  getRoutes = routes => {
    return routes.map((prop, key) => {

        if(AuthService.getUser().isAdmin) {
          if (prop.layout === "/") {
            return (
                <Route
                    path={prop.layout + prop.path}
                    component={prop.component}
                    key={key} exact
                />
            );
          } else {
            return (<Route
                    path={"/dashboard"}
                    component={Index}
                    key={key}
                />
            );
          }
        }
        else if(!AuthService.getUser().isAdmin && prop.admin) {
          return;
        }
        else{
          if (prop.layout === "/") {
            return (
                <Route
                    path={prop.layout + prop.path}
                    component={prop.component}
                    key={key} exact
                />
            );
          } else {
            return (<Route
                    path={"/dashboard"}
                    component={Index}
                    key={key}
                />
            );
          }

        }
    });
  };

  getBrandText = path => {
    for (let i = 0; i < routes.length; i++) {
      if ( routes[i].show &&  this.props.location.pathname.indexOf(routes[i].layout + routes[i].path ) !== -1) {
          return routes[i].name;
      }
    }
    return "Brand";
  };
  render() {
    return (

      <>
        <Sidebar
          {...this.props}
          routes={routes}
          logo={{
            innerLink: "/",
            imgSrc: require("assets/img/brand/orange.jpg"),
            imgAlt: "..."
          }}
        />
        <div className="main-content" ref="mainContent">
          <AdminNavbar
            {...this.props}
            brandText={this.getBrandText(this.props.location.pathname)}
          />
          <Switch>
            {this.getRoutes(routes)}
          </Switch>
          <Container fluid>
            <AdminFooter />
          </Container>
        </div>
      </>
    );
  }
}

export default Admin;
