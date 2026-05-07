import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Trending from "./pages/Trending";
import Banner from "./pages/Banner";
import Video from "./pages/Video";
import BrandStory from "./pages/BrandStory";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import DeliveryFee from "./pages/DeliveryFee";
import Categories from "./pages/Categories";
import Customer from "./pages/customer";
import Contact from "./pages/Contact";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Return from "./pages/Return";
import Shipping from "./pages/Shipping";
import HeaderSetting from "./pages/HeaderSetting";
import About from "./pages/About";
import FooterSettings from "./pages/FooterSettings";

function App() {
  return (
    <>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/banner" element={<Banner />} />
          <Route path="/video" element={<Video />} />
          <Route path="/brand-story" element={<BrandStory />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/delivery-fee" element={<DeliveryFee />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/contact" element={<Contact />} />

          {/* SETTINGS */}
          <Route path="/settings/privacy" element={<Privacy />} />
          <Route path="/settings/terms" element={<Terms />} />
          <Route path="/settings/return" element={<Return />} />
          <Route path="/settings/shipping" element={<Shipping />} />

          {/* ✅ FIXED */}
          <Route path="/header-setting" element={<HeaderSetting />} />
          <Route path="/admin/about" element={<About />} />
          <Route path="/admin/footer-settings" element={<FooterSettings />} />

        </Route>

      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;