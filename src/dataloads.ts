import axios, { AxiosInstance } from "axios";

const apiClient: AxiosInstance = axios.create({
  baseURL:  "https://689gkroy78.execute-api.eu-west-1.amazonaws.com/skjalftalisa/v1/quake", // arr<y
  headers: {
    "Content-type": "application/json",
  },
});

export default apiClient;
//Vue.axios.defaults.baseURL = "http://isapi.rasmuskr.dk/api/"; // earthquakes/?date=72-hoursago
//Vue.axios.defaults.baseURL = "https://api.vedur.is/skjalftalisa/v1/quake/"; // array/
