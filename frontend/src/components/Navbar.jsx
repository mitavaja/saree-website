import React, { useState, useContext, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const Navbar = () => {
  const { user, logout: authLogout } = useContext(AuthContext);
  const { cartItems, wishlistItems, products, setToken } = useContext(ShopContext);
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
    <div className="w-full bg-[#082e21]/90 backdrop-blur-md sticky top-0 z-[999] shadow-sm border-b border-white/10">
      <div className="w-full px-6 lg:px-12 flex items-center justify-between py-2 font-medium">
        
        {/* Logo */}
        <Link to="/">
          <img
            src={logo || assets.logo}
            alt="logo"
            className="h-10 md:h-14 w-auto object-contain transition-all duration-300"
          />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden sm:flex gap-8 text-sm text-[#ecc153] font-semibold">

          {navLinks.map((item, index) => (
            <NavLink
              key={index}
              to={item.link}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 ${
                  isActive ? "border-b-2 border-[#ecc153]" : ""
                }`
              }
            >
              <p>{item.name}</p>
            </NavLink>
          ))}

        </ul>

        {/* Icons */}
        <div className="flex items-center gap-6 relative">

          {/* SEARCH */}
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`absolute right-0 w-64 pl-3 pr-10 py-2 text-sm text-[#ecc153] bg-transparent outline-none border-b-2 border-l-2 border-[#ecc153]
              transition-all duration-300 ease-in-out
              ${
                showSearch
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10 pointer-events-none"
              }`}
            />

            <img
              src={assets.search_icon}
              alt="search"
              onClick={() => setShowSearch(!showSearch)}
              className="w-5 cursor-pointer brightness-0 invert sepia saturate-[1000%] hue-rotate-[5deg]"
            />
          </div>

          {/* SEARCH RESULT */}
          {showSearch && search && (
            <div className="absolute top-12 left-0 right-0 bg-white shadow-lg z-40 max-h-80 overflow-y-auto rounded-md">
              {searchProducts.length > 0 ? (
                searchProducts.map((item) => (
                  <Link
                    to={`/product/${item._id}`}
                    key={item._id}
                    className="flex items-center gap-4 p-3 hover:bg-gray-100"
                    onClick={() => {
                      setShowSearch(false);
                      setSearch("");
                    }}
                  >
                    <img
                      src={item.image[0]}
                      alt={item.name}
                      className="w-10 h-10 object-cover"
                    />
                    <p className="text-sm">{item.name}</p>
                  </Link>
                ))
              ) : (
                <p className="p-4 text-gray-500 text-sm text-center">
                  No product found
                </p>
              )}
            </div>
          )}

          {/* Wishlist */}
          <Link to="/wishlist" className="relative">
            <img
              src={assets.wishlist_icon}
              alt="wishlist"
              className="w-5 cursor-pointer brightness-0 invert sepia saturate-[1000%] hue-rotate-[5deg]"
            />
            <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-[#ecc153] text-[#082e21] aspect-square rounded-full text-[8px] font-semibold">
              {wishlistCount}
            </p>
          </Link>

          {/* Profile */}
          <Link to="/profile" className="relative group">
            <img
              src={assets.profile_icon}
              alt="profile"
              className="w-5 cursor-pointer brightness-0 invert sepia saturate-[1000%] hue-rotate-[5deg] transition-transform duration-300 group-hover:scale-110"
            />
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <img
              src={assets.cart_icon}
              alt="cart"
              className="w-5 cursor-pointer brightness-0 invert sepia saturate-[1000%] hue-rotate-[5deg]"
            />

            <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-[#ecc153] text-[#082e21] aspect-square rounded-full text-[8px] font-semibold">
              {cartCount}
            </p>
          </Link>

          {/* Mobile Menu */}
          <img
            onClick={() => setVisible(true)}
            src={assets.menu_icon}
            className="w-5 cursor-pointer sm:hidden"
            alt="menu"
          />

        </div>
      </div>
    </div>
  );
};

export default Navbar;