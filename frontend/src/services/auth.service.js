import axios from "axios";

const AUTH_HOST = process.env.REACT_APP_BACKEND_HOST;

const AuthService = {};
AuthService.login = (email, password) => {
  return axios.post(AUTH_HOST + "/admins/login", {
    email: email,
    password: password,
  });
};
AuthService.register = (email, password, name) => {
  return axios.post(AUTH_HOST + "/admins", {
    name: name,

    email: email,
    password: password,
  });
};

AuthService.logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("admin");
};

AuthService.isLoggedIn = () => {
  let token = JSON.parse(localStorage.getItem("token"));
  if (token) {
    let payload = atob(token.split(".")[1]);
    let exp = new Date(JSON.parse(payload).exp * 1000);
    return exp > new Date();
  } else {
    return false;
  }
};
AuthService.getUser = () => {
  if (AuthService.isLoggedIn()) {
    let user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      return user;
    } else {
      return false;
    }
  } else {
    return false;
  }
};
AuthService.authHeader = () => {
  if (AuthService.isLoggedIn()) {
    let token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      return {
        headers: {
          Authorization: token,
        },
      };
    } else {
      window.location.href = "/auth/login";
    }
  } else {
    window.location.href = "/auth/login";
  }
};

AuthService.update = (cashier) => {
  return axios.put(
    AUTH_HOST + "/cashiers/" + cashier._id,
    cashier,
    AuthService.authHeader()
  );
};
AuthService.getOne = (id) => {
  console.log(id);
  return axios.get(AUTH_HOST + "/cashiers/" + id, AuthService.authHeader());
};

AuthService.forgetPassword = (email) => {
  return axios.get(AUTH_HOST + "/reset/cashiers/" + email);
};

AuthService.resetPassword = (data) => {
  return axios.post(AUTH_HOST + "/reset/cashiers", data);
};

export default AuthService;
