import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";

import {
  MdDashboard,
  MdTrendingUp,
  MdShoppingBag,
  MdCategory,
  MdShoppingCart,
  MdPerson,
  MdMessage,
  MdVideoLibrary,
  MdPhoto,
  MdSettings,
  MdExpandMore,
  MdLocalShipping   
} from "react-icons/md";

const Sidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  // ✅ UPDATED MENU (Delivery Fee added below Orders)
  const menu = [
    { name: "Dashboard", icon: <MdDashboard size={22} />, path: "/dashboard" },
    { name: "Trending", icon: <MdPhoto size={22} />, path: "/trending" },
    { name: "Banner", icon: <MdPhoto size={22} />, path: "/banner" },
    { name: "Video", icon: <MdVideoLibrary size={22} />, path: "/video" },
    {name : "Brand story",icon : <MdVideoLibrary size={22} />,path : "/brand-story"},
    { name: "Categories", icon: <MdCategory size={22} />, path: "/categories" },
    { name: "Products", icon: <MdShoppingBag size={22} />, path: "/products" },

    { name: "Orders", icon: <MdShoppingCart size={22} />, path: "/orders" },

    // ✅ 👇 YAHI ADD KIYA (Orders ke niche)
    { name: "Delivery Fee", icon: <MdLocalShipping size={22} />, path: "/delivery-fee" },

    { name: "Customer", icon: <MdPerson size={22} />, path: "/customer" },
    { name: "Contact", icon: <MdMessage size={22} />, path: "/contact" },
  ];

  const settingsMenu = [
    { name : "Header Setting", path : "/header-setting" },
    { name: "About Setting", path: "/admin/about" },   
    { name: "Footer Settings", path: "/admin/footer-settings" }, 
    { name: "Privacy Policy", path: "/settings/privacy" },
    { name: "Terms & Conditions", path: "/settings/terms" },
    { name: "Return Policy", path: "/settings/return" },
    { name: "Shipping Policy", path: "/settings/shipping" },
  ];

  return (
    <div
      className={`${open ? "w-64" : "w-20"} h-screen bg-[#082e21] text-[#ecc153] flex flex-col fixed justify-between transition-all duration-300`}
    >
      <div className="flex flex-col h-full overflow-y-auto">

        {/* Top */}
        <div className="p-6 border-b border-[#ecc153] flex items-center justify-between">
          {open && <img src={logo} alt="logo" className="w-40" />}
          <button
            onClick={() => setOpen(!open)}
            className="text-2xl hover:text-white transition"
          >
            ☰
          </button>
        </div>

        {/* Menu */}
        <nav className="flex flex-col p-4 gap-2">
          {menu.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300
                ${isActive ? "bg-[#ecc153] text-[#082e21]" : "hover:bg-[#ecc153] hover:text-[#082e21]"}`
              }
            >
              <span className="group-hover:scale-125 transition-transform duration-300">
                {item.icon}
              </span>
              {open && <span>{item.name}</span>}
            </NavLink>
          ))}

          {/* SETTINGS */}
          <div>
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-md hover:bg-[#ecc153] hover:text-[#082e21] transition"
            >
              <div className="flex items-center gap-3">
                <MdSettings size={22} />
                {open && <span>Settings</span>}
              </div>

              {open && (
                <MdExpandMore
                  className={`transition-transform duration-300 ${
                    settingsOpen ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>

            {settingsOpen && open && (
              <div className="ml-8 flex flex-col gap-2 mt-2">
                {settingsMenu.map((item, i) => (
                  <NavLink
                    key={i}
                    to={item.path}
                    className={({ isActive }) =>
                      `text-sm px-3 py-2 rounded transition ${
                        isActive
                          ? "bg-[#ecc153] text-[#082e21]"
                          : "hover:bg-[#ecc153] hover:text-[#082e21]"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-[#ecc153]">
        <button 
          onClick={handleLogout}
          className="w-full bg-[#ecc153] text-[#082e21] py-2 rounded font-semibold hover:bg-white transition"
        >
          {open ? "Logout" : "⎋"}
        </button>
      </div>

    </div>
  );
};

export default Sidebar;