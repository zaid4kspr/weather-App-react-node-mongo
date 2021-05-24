import React from "react";
import ReactDOM from "react-dom";
import {
    BrowserRouter,
    Route,
    Switch,
} from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import WebViewsLayout from "layouts/WebViews.js";

import AuthService from "./services/auth.service";


ReactDOM.render( 
    <BrowserRouter>
        <Switch>
    <Route path = "/auth" render = { (props) => < AuthLayout {...props}/> } />
    <Route path = "/webviews" render = { (props) => < WebViewsLayout {...props}/> } />
    <Route path = "/" render = {props => < AdminLayout user={AuthService.getUser()} {...props}/> }  />
    </Switch> 
    </BrowserRouter>, document.getElementById("root")
                
                );
