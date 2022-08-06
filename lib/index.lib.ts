import axios from "axios";

const Axios = axios.create({
  baseURL: "https://afrobank.herokuapp.com/Api/v1",
});

export { Axios };
