import axios from "axios";

const API = "http://localhost:5000/api";

// ✅ GET ALL PRODUCTS
export const getProducts = async () => {
  try {

    const response = await axios.get(`${API}/product/list`);

    if (response.data?.success) {
      return response.data.products;
    }

    return [];

  } catch (error) {
    console.error("Product fetch error:", error.message);
    return [];
  }
};


// ✅ GET SINGLE PRODUCT
export const getProductById = async (id) => {
  try {

    if (!id) return null;

    const response = await axios.get(`${API}/product/${id}`);

    if (response.data?.success) {
      return response.data.product;
    }

    return null;

  } catch (error) {
    console.error("Single product error:", error.message);
    return null;
  }
};