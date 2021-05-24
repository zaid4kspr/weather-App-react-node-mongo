import axios from "axios";
import AuthService from './auth.service';


const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST;

const UserService = {}
UserService.filter = (filter) => {
        return axios.post(BACKEND_HOST + "/dashboard/users/filter",filter, AuthService.authHeader());
    }

UserService.getOne = (id) => {
    return axios.get(BACKEND_HOST + "/dashboard/users/" + id, AuthService.authHeader());
}

    UserService.update = (user) => {
    return axios.put(BACKEND_HOST + "/dashboard/users/" + user._id,user, AuthService.authHeader());
}


UserService.logout = ()=> {
        localStorage.removeItem("token");
        localStorage.removeItem("admin");
    }

UserService.getAdmin = () =>{
        let admin = JSON.parse(localStorage.getItem('admin'));
        if (admin) {
            return admin;
        } else {
            return false;
        }
    }   

export default UserService;