import axios from "axios";

/* ✅ SINGLE AXIOS INSTANCE */
const API = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000
});

/* ✅ GLOBAL ERROR HANDLER */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API ERROR:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/* 🔍 SEARCH MEDICINE + NEARBY HOSPITALS (Patient Side) */
export const searchMedicine = (medicine, lat, lng) => {
  return API.get("/search", {
    params: { medicine, lat, lng }
  });
};

/* 🚨 EMERGENCY MODE (Hospitals + Critical Meds) */
export const emergencySearch = (lat, lng) => {
  return API.get("/emergency-search", {
    params: { lat, lng } // Added params to fix navigation/distance logic
  });
};

/* ➕ PHARMACY DASHBOARD ACTIONS */
export const addMedicine = (data) => {
  return API.post("/add-medicine", data);
};

export const updateStock = (data) => {
  return API.post("/update-stock", data);
};

/* 📜 VIEW UPDATE HISTORY (Fixes the import error) */
export const getUpdateHistory = () => {
  return API.get("/stock-history");
};

/* 🔔 SMS ALERTS */
export const subscribeSMS = (data) => {
  return API.post("/subscribe-alert", data);
};

/* 📦 GET ALL (OPTIONAL) */
export const getAllMedicines = () => {
  return API.get("/all");
};

export default API;