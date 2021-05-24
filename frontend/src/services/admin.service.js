import axios from "axios";
import AuthService from './auth.service';


const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST;

const AdminService = {}
AdminService.filter = (filter) => {
        return axios.post(BACKEND_HOST + "/dashboard/admins/filter",filter,AuthService.authHeader());
    }
AdminService.getOne = (id) => {
    return axios.get(BACKEND_HOST + "/dashboard/admins/" + id,AuthService.authHeader());
}

    AdminService.update = (data) => {
    return axios.put(BACKEND_HOST + "/dashboard/admins/" + data._id,data,AuthService.authHeader());
}
AdminService.add = (data) => {
    return axios.post(BACKEND_HOST + "/dashboard/admins",data,AuthService.authHeader());
}

AdminService.logout = ()=> {
        localStorage.removeItem("token");
        localStorage.removeItem("admin");
    }

AdminService.getAdmin = () =>{
        let admin = JSON.parse(localStorage.getItem('admin'));
        if (admin) {
            return admin;
        } else {
            return false;
        }
    }   

export default AdminService;