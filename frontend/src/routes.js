import Index from "components/Dashboard/index.js";
import Login from "components/Auth/login.js";
import ForgetPassword from "components/Auth/forgetPassword";
import Register from "components/Auth/register";


const routes = [

    {
        path: "",
        name: "Tableau de bord",
        icon: "ni ni-tv-2 text-primary",
        component: Index,
        layout: "/",
        show: true,
        admin: false

    },
 

    {
        path: "/login",
        name: "Login",
        icon: "ni ni-delivery-fast text-warning",
        component: Login,
        layout: "/auth",
        admin: false

    },   
    {
        path: "/register",
        name: "Register",
        icon: "ni ni-delivery-fast text-warning",
        component: Register,
        layout: "/auth",
        admin: false

    },


];
export default routes;
