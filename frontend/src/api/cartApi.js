import axios from "axios"

const API = "http://localhost:5000/api/cart"

export const addCart = (data)=>{
  return axios.post(`${API}/add`,data)
}

export const getCart = (userId)=>{
  return axios.get(`${API}/user/${userId}`)
}

export const removeCart = (data)=>{
  return axios.post(`${API}/remove`,data)
}