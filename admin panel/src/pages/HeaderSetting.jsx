import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const HeaderSetting = () => {
  const [navLinks, setNavLinks] = useState([]);
  const [logo, setLogo] = useState(false);
  const [currentLogo, setCurrentLogo] = useState("");

  // Fetch Header Data
  const fetchHeaderData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/header/get");
      if (response.data.success) {
        setNavLinks(response.data.header.navLinks || []);
        if (response.data.header.logo) {
          setCurrentLogo(`http://localhost:5000${response.data.header.logo}`);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchHeaderData();
  }, []);

  const handleLinkChange = (index, field, value) => {
    const updatedLinks = [...navLinks];
    updatedLinks[index][field] = value;
    setNavLinks(updatedLinks);
  };

  const saveHeaderData = async () => {
    try {
      // Basic validation
      for (let link of navLinks) {
        if (!link.name || !link.link) {
          toast.error("Please fill all link fields");
          return;
        }
      }

      const formData = new FormData();
      formData.append("navLinks", JSON.stringify(navLinks));
      if (logo) {
        formData.append("logo", logo);
      }

      const response = await axios.post("http://localhost:5000/api/header/update", formData);
      if (response.data.success) {
        toast.success(response.data.message);
        setLogo(false);
        fetchHeaderData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-[#082e21]">Header Navbar Settings</h2>

      <div className="bg-white p-6 rounded shadow-md">
        {/* Logo Section */}
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">Logo Upload</h3>
        <div className="flex flex-col gap-4 mb-8">
          <p className="text-sm text-gray-600">Upload new logo image</p>
          <label htmlFor="logo" className="cursor-pointer">
            <img
              src={!logo ? (currentLogo || assets.logo) : URL.createObjectURL(logo)}
              alt="logo upload"
              className="w-32 h-32 object-contain bg-gray-100 p-2 rounded border border-gray-300"
            />
          </label>
          <input
            onChange={(e) => setLogo(e.target.files[0])}
            type="file"
            id="logo"
            hidden
            accept="image/*"
          />
        </div>

        <h3 className="text-lg font-semibold mb-4 border-b pb-2">Navigation Links</h3>

        {navLinks.map((link, index) => (
          <div key={index} className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Link Name (e.g. HOME)</label>
              <input
                type="text"
                value={link.name}
                onChange={(e) => handleLinkChange(index, "name", e.target.value)}
                className="w-full border rounded px-3 py-2 outline-none focus:border-[#ecc153]"
                placeholder="Name"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">URL Path (e.g. /home)</label>
              <input
                type="text"
                value={link.link}
                onChange={(e) => handleLinkChange(index, "link", e.target.value)}
                className="w-full border rounded px-3 py-2 outline-none focus:border-[#ecc153]"
                placeholder="/url-path"
              />
            </div>
          </div>
        ))}

        <button
          onClick={saveHeaderData}
          className="w-full bg-[#082e21] text-[#ecc153] py-3 mt-6 rounded font-bold text-lg hover:bg-[#061f16] transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default HeaderSetting;
