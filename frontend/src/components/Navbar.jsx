import React, { useState, useContext, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { LuSearch, LuHeart, LuUser, LuShoppingCart, LuMenu } from "react-icons/lu";

const Navbar = () => {
  const { user, logout: authLogout } = useContext(AuthContext);
  const { cartItems, wishlistItems, products, setToken, token } = useContext(ShopContext);
  const navigate = useNavigate();

  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);
  const [navLinks, setNavLinks] = useState([
    { name: "HOME", link: "/" },
    { name: "COLLECTION", link: "/collection" },
    { name: "ABOUT", link: "/about" },
    { name: "CONTACT", link: "/contact" }
  ]);
  const [logo, setLogo] = useState("");

  useEffect(() => {
    const fetchNavLinks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/header/get");
        if (response.data.success && response.data.header) {
          if (response.data.header.navLinks) {
            setNavLinks(response.data.header.navLinks);
          }
          if (response.data.header.logo) {
            setLogo(`http://localhost:5000${response.data.header.logo}`);
          }
        }
      } catch (error) {
        console.log("Error fetching header links:", error);
      }
    };
    fetchNavLinks();
  }, []);

  const cartCount = Object.values(cartItems).reduce((a, b) => a + b, 0);
  const wishlistCount = Object.keys(wishlistItems).length;

  const searchProducts = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => {
    authLogout();
    setToken("");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="w-full bg-white backdrop-blur-xl sticky top-0 z-[999] shadow-[0_4px_30px_rgba(0,0,0,0.04)] border-b border-[#082e21]/5 transition-all duration-300">
      <div className="w-full px-6 lg:px-12 flex items-center justify-between py-0 font-medium">
        
        {/* Logo */}
        <Link to="/" className="flex-shrink-0 flex items-center -my-2 md:-my-4">
          <img
            src={logo || assets.logo}
            alt="logo"
            className="h-16 md:h-24 w-auto object-contain transition-transform duration-300 hover:scale-105"
          />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-[14px] text-[#082e21] font-semibold tracking-wider">
          {navLinks.map((item, index) => (
            <NavLink
              key={index}
              to={item.link}
              className={({ isActive }) =>
                `relative group flex flex-col items-center gap-1 transition-colors duration-300 hover:text-[#082e21]/80 ${
                  isActive ? "text-[#082e21]" : "text-[#082e21]/90"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{item.name}</span>
                  <span
                    className={`absolute -bottom-2 left-0 w-full h-[2px] bg-[#082e21] transition-all duration-300 rounded-full ${
                      isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-5 sm:gap-7 relative text-[#082e21]">
          
          {/* SEARCH */}
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`absolute right-8 w-60 sm:w-72 pl-4 pr-10 py-2.5 text-sm text-[#082e21] bg-white outline-none border border-[#082e21]/20 rounded-full shadow-sm placeholder:text-[#082e21]/40
              transition-all duration-300 ease-in-out
              ${
                showSearch
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-4 pointer-events-none"
              }`}
            />
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="p-1.5 hover:bg-[#082e21]/5 rounded-full transition-colors duration-300 z-10"
            >
              <LuSearch className="w-[22px] h-[22px] cursor-pointer transition-transform duration-300 hover:scale-110" />
            </button>
          </div>

          {/* SEARCH RESULT */}
          {showSearch && search && (
            <div className="absolute top-16 right-1/2 translate-x-1/2 w-[350px] bg-white shadow-[0_15px_40px_rgba(0,0,0,0.1)] border border-gray-100 z-40 max-h-[400px] overflow-y-auto rounded-2xl py-2 custom-scrollbar">
              {searchProducts.length > 0 ? (
                searchProducts.map((item) => {
                  let imgSrc = Array.isArray(item.image) ? item.image[0] : item.image;
                  if (typeof imgSrc === 'string' && !imgSrc.startsWith("http") && !imgSrc.startsWith("/") && !imgSrc.startsWith("data:")) {
                    imgSrc = `http://localhost:5000/uploads/${imgSrc}`;
                  }
                  return (
                  <Link
                    to={`/product/${item._id}`}
                    key={item._id}
                    className="flex items-center gap-4 px-5 py-3 hover:bg-[#082e21]/5 transition-colors duration-200"
                    onClick={() => {
                      setShowSearch(false);
                      setSearch("");
                    }}
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-gray-100 bg-gray-50">
                      <img
                        src={imgSrc}
                        alt={item.name}
                        className="w-full h-full object-cover mix-blend-multiply"
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-[#082e21] line-clamp-1">{item.name}</p>
                      <p className="text-xs text-[#082e21]/70 font-bold mt-1">₹{item.price}</p>
                    </div>
                  </Link>
                )})
              ) : (
                <div className="p-8 text-[#082e21]/50 text-sm text-center flex flex-col items-center gap-3">
                  <LuSearch className="w-8 h-8 opacity-40" />
                  <p>No products found</p>
                </div>
              )}
            </div>
          )}

          {/* Wishlist */}
          <Link to="/wishlist" className="relative p-1.5 hover:bg-[#082e21]/5 rounded-full transition-colors duration-300">
            <LuHeart className="w-[22px] h-[22px] cursor-pointer transition-transform duration-300 hover:scale-110" />
            {wishlistCount > 0 && (
              <span className="absolute right-0 top-0 w-4 h-4 flex items-center justify-center bg-[#082e21] text-white rounded-full text-[10px] font-bold shadow-sm border border-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Profile */}
          <Link to="/profile" className="relative group p-1.5 hover:bg-[#082e21]/5 rounded-full transition-colors duration-300 hidden sm:block">
            <LuUser className="w-[22px] h-[22px] cursor-pointer transition-transform duration-300 hover:scale-110" />
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative p-1.5 hover:bg-[#082e21]/5 rounded-full transition-colors duration-300">
            <LuShoppingCart className="w-[22px] h-[22px] cursor-pointer transition-transform duration-300 hover:scale-110" />
            {cartCount > 0 && (
              <span className="absolute right-0 top-0 w-4 h-4 flex items-center justify-center bg-[#082e21] text-white rounded-full text-[10px] font-bold shadow-sm border border-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setVisible(true)}
            className="md:hidden p-1.5 hover:bg-[#082e21]/5 rounded-full transition-colors duration-300"
          >
            <LuMenu className="w-[24px] h-[24px] cursor-pointer" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;