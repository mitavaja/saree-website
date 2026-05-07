import React, { useState } from "react";
import { MdNotifications, MdSearch, MdAccountCircle, MdLogout } from "react-icons/md";

const AdminHeader = ({
  title = "Dashboard",
  onLogout,
  onSearch,
  userName = "Admin",
}) => {
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    setSearch(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <div className="w-full h-16 bg-[#082e21] text-[#ecc153] flex items-center justify-between px-6 shadow-md sticky top-0 z-50">

      {/* LEFT: Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold tracking-wide">
          {title}
        </h1>
      </div>

      {/* CENTER: Search */}
      <div className="hidden md:flex items-center bg-[#061f16] px-3 py-2 rounded-md w-80">
        <MdSearch size={20} />
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search..."
          className="bg-transparent outline-none px-2 w-full text-sm text-[#ecc153]"
        />
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-5">

        {/* Notification */}
        <div className="relative cursor-pointer hover:text-white transition">
          <MdNotifications size={24} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </div>

        {/* User */}
        <div className="flex items-center gap-2 cursor-pointer hover:text-white transition">
          <MdAccountCircle size={26} />
          <span className="text-sm font-medium hidden sm:block">
            {userName}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex items-center gap-1 bg-[#ecc153] text-[#082e21] px-3 py-1 rounded-md text-sm font-semibold hover:bg-white transition"
        >
          <MdLogout size={18} />
          Logout
        </button>

      </div>
    </div>
  );
};

export default AdminHeader;