import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
// reactstrap components
import { Container, Row, Col } from "reactstrap";

// core components
import AuthFooter from "components/Footers/AuthFooter.js";
import AuthNavbar from "components/Navbars/AuthNavbar.js";

import routes from "routes.js";

class WebViews extends React.Component {
    componentDidMount() {
        document.body.classList.add("bg-default");
    }
    componentWillUnmount() {
        document.body.classList.remove("bg-default");
    }
    getRoutes = routes => {
        return routes.map((prop, key) => {

            if (prop.layout === "/webviews") {
                return (
                    <Route
                        path={prop.layout + prop.path}
                        component={prop.component}
                        key={key} exact
                    />
                );
            } else {
                return null;
            }
        });
    };
    render() {
        return (
            <>
                <div className="main-content">
                    {/* Page content */}
                    <Container className="mt--8 pb-5">
                        <Row className="justify-content-center">
                            <Switch>
                                {this.getRoutes(routes)}
                            </Switch>
                        </Row>
                    </Container>
                </div>
            </>
        );
    }
}

export default WebViews;
