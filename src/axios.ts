import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.kiln.fi",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${import.meta.env.VITE_KILN_API_KEY}`,
  },
});

export default instance;