import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ShopContext = createContext();

const API = "http://localhost:5000/api";

const ShopContextProvider = (props) => {

    const currency = "₹";
    const delivery_fee = 10;

    const [products,setProducts] = useState([]);
    const [cartItems,setCartItems] = useState({});
    const [wishlistItems,setWishlistItems] = useState({});
    const [banners,setBanners] = useState([]);

    const [userProfile,setUserProfile] = useState({});
    const [userOrders,setUserOrders] = useState([]);
    const [token,setToken] = useState(localStorage.getItem("token") || "");

    // ✅ FETCH PRODUCTS
    const fetchProducts = async () => {
        try{
            const res = await axios.get(`${API}/product/list`);

            if(res.data.success){

                const productsWithImages = res.data.products.map(product => ({
                    ...product,

                    // ✅ IMAGE FIX
                    image: product.image ? `http://localhost:5000${product.image}` : "",

                    images: Array.isArray(product.images)
                        ? product.images.filter(Boolean).map(img => `http://localhost:5000${img}`)
                        : [],

                    video: product.video ? `http://localhost:5000${product.video}` : "",

                    // 🔥 NEW SAFE FIELDS
                    description: product.description || "",
                    features: Array.isArray(product.features) ? product.features : [],
                    bestsellerCount: product.bestsellerCount || 0
                }));

                setProducts(productsWithImages);
            }

        }catch(error){
            console.log(error);
        }
    };

    // FETCH BANNERS
    const fetchBanners = async () => {
        try{
            const res = await axios.get(`${API}/banner/list`);
            if(res.data.banners){
                setBanners(res.data.banners);
            }
        }catch(error){
            console.log(error);
        }
    };

    // LOAD LOCAL STORAGE
    useEffect(()=>{
        const savedCart = localStorage.getItem("cartItems");
        const savedWishlist = localStorage.getItem("wishlistItems");

        if(savedCart) setCartItems(JSON.parse(savedCart));
        if(savedWishlist) setWishlistItems(JSON.parse(savedWishlist));
    },[]);

    // INITIAL FETCH
    useEffect(()=>{
        fetchProducts();
        fetchBanners();
    },[]);

    // USER PROFILE
    const fetchUserProfile = async () => {
        if(!token) return;
        try{
            const res = await axios.get(`${API}/user/profile`, { headers: { token } });
            if(res.data.success) setUserProfile(res.data.user);
        }catch(err){ console.log(err); }
    };

    // USER ORDERS
    const fetchUserOrders = async () => {
        if(!token) return;
        try{
            const res = await axios.get(`${API}/user/orders`, { headers: { token } });
            if(res.data.success) setUserOrders(res.data.orders);
        }catch(err){ console.log(err); }
    };

    // CART
    const addToCart = (itemId,qty=1) => {
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]) cartData[itemId] += qty;
        else cartData[itemId] = qty;

        setCartItems(cartData);
        localStorage.setItem("cartItems",JSON.stringify(cartData));
    };

    const removeFromCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]) delete cartData[itemId];
        setCartItems(cartData);
        localStorage.setItem("cartItems",JSON.stringify(cartData));
    };

    // WISHLIST
    const addToWishlist = (itemId) => {
        let wishlistData = structuredClone(wishlistItems);
        if(wishlistData[itemId]) delete wishlistData[itemId];
        else wishlistData[itemId] = true;

        setWishlistItems(wishlistData);
        localStorage.setItem("wishlistItems",JSON.stringify(wishlistData));
    };

    // SAVE PROFILE
    const saveUserProfile = async (data) => {
        if(!token) return;
        try{
            const res = await axios.post(`${API}/user/update`, data, { headers: { token } });
            if(res.data.success){
                setUserProfile(res.data.user);
            }
        }catch(err){ console.log(err); }
    };

    const value = {
        products,
        currency,
        delivery_fee,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        wishlistItems,
        addToWishlist,
        banners,
        fetchBanners,

        token,
        setToken,
        userProfile,
        saveUserProfile,
        userOrders,
        fetchUserProfile,
        fetchUserOrders
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;