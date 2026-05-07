import axios from "axios";

const API = "http://localhost:5000/api/order";

export const placeOrder = async (data) => {
  const res = await axios.post(`${API}/place`, data);
  return res.data;
};

export const getUserOrders = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No auth token found");
  }
  const res = await axios.get(`${API}/user`, { 
    headers: { token } 
  });
  return res.data;
};

