import axios from "axios";

const API = "http://localhost:5000/api/user";

// ✅ GET PROFILE
export const fetchProfile = async (token) => {
  const res = await axios.get(
    `${API}/profile`,
    { headers: { token } }
  );
  return res.data;
};

// ✅ UPDATE PROFILE (POST is correct here)
export const updateProfile = async (data, token) => {
  const res = await axios.post(
    `${API}/update`,
    data,
    { headers: { token } }
  );
  return res.data;
};

// ✅ GET ORDERS
export const fetchOrders = async (token) => {
  const res = await axios.get(
    `${API}/orders`,
    { headers: { token } }
  );
  return res.data;
};