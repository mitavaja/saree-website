import axios from "axios"

const API = "http://localhost:5000/api/wishlist"

export const addWishlist = (data)=>{
  return axios.post(`${API}/add`,data)
}

export const getWishlist = (userId)=>{
  return axios.get(`${API}/user/${userId}`)
}