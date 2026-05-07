import axios from "axios";

const API = "http://localhost:5000/api/banner";

export const getBanners = async () => {
  try {
    const res = await axios.get(`${API}/list`);
    return res.data.banners;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const addBanner = async (bannerData) => {
  const formData = new FormData();
  formData.append("title", bannerData.title);
  formData.append("subtitle", bannerData.subtitle || "");
  formData.append("buttonText", bannerData.buttonText || "SHOP NOW");
  if (bannerData.image) formData.append("image", bannerData.image);
  const res = await axios.post(`${API}`, formData);
  return res.data.banner;
};

export const updateBanner = async (id, bannerData) => {
  const formData = new FormData();
  formData.append("title", bannerData.title);
  formData.append("subtitle", bannerData.subtitle || "");
  formData.append("buttonText", bannerData.buttonText || "SHOP NOW");
  if (bannerData.image) formData.append("image", bannerData.image);
  const res = await axios.put(`${API}/${id}`, formData);
  return res.data.banner;
};

export const deleteBanner = async (id) => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data;
};