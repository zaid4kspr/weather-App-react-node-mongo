import axios from "axios";
import AuthService from "./auth.service";

const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST;

const AnalyticsService = {};
AnalyticsService.byDriver = (driver) => {
  return axios.post(BACKEND_HOST + "/dashboard/analytics/drivers", driver);
};
AnalyticsService.index = () => {
  return axios.get(BACKEND_HOST + "/analytics", AuthService.authHeader());
};

AnalyticsService.watch = () => {
  return axios.get(BACKEND_HOST + "/dashboard/watch", AuthService.authHeader());
};

AnalyticsService.watchList = () => {
  return axios.get(
    BACKEND_HOST + "/weather/myWatchList",
    AuthService.authHeader()
  );
};

AnalyticsService.addToMyWatchList = (body) => {
  return axios.post(
    BACKEND_HOST + "/weather/myWatchList/add",
    body,
    AuthService.authHeader()
  );
};

AnalyticsService.getWeatherByIp = (myIp) => {
  return axios.get(
    BACKEND_HOST + "/weather/city/" + myIp,
    AuthService.authHeader()
  );
};
AnalyticsService.getForecastByIp = (myIp) => {
  return axios.get(
    BACKEND_HOST + "/weather/forecast/" + myIp,
    AuthService.authHeader()
  );
};
AnalyticsService.getCities = (keyword) => {
  return axios.get(
    BACKEND_HOST + "/weather/cities/" + keyword,
    AuthService.authHeader()
  );
};

AnalyticsService.shareWeather = (body) => {
  return axios.post(
    BACKEND_HOST + "/weather/myWatchList/share" ,body,
    AuthService.authHeader()
  );
};
export default AnalyticsService;
