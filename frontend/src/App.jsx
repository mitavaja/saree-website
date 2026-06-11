import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ShopContextProvider from "./context/ShopContext";
import AuthContextProvider from "./context/AuthContext";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import PlaceOrder from "./pages/PlaceOrder";
import Wishlist from "./pages/Wishlist";
import MyProfile from "./pages/MyProfile";
import MyOrders from "./pages/MyOrders";
import Login from "./pages/Login";

import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import ReturnPolicy from "./pages/ReturnPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";



const App = () => {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <ShopContextProvider>

          <Navbar />
          <div className="w-full overflow-x-clip pb-16 md:pb-0">

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/collection" element={<Collection />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/product/:productId" element={<Product />} />

              {/* Cart */}
              <Route path="/cart" element={<Cart />} />

              {/* Place Order */}
              <Route path="/place-order" element={<PlaceOrder />} />

              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/profile" element={<MyProfile />} />
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/login" element={<Login />} />
{/* Footer */}
<Route path="/privacy-policy" element={<PrivacyPolicy />} />
<Route path="/terms-conditions" element={<Terms />} />
<Route path="/return-policy" element={<ReturnPolicy />} />
<Route path="/shipping-policy" element={<ShippingPolicy />} />

            </Routes>

            <ToastContainer
              position="top-right"
              autoClose={2500}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              pauseOnHover
              theme="light"
            />

          </div>

        </ShopContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  );
};

export default App;
