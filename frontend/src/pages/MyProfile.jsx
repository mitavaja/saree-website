import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";

const MyProfile = () => {
  const { userProfile, fetchUserProfile, saveUserProfile, token, setToken, userOrders, fetchUserOrders } = useContext(ShopContext);
  const { logout: authLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile.name || "",
    email: userProfile.email || "",
    phone: userProfile.phone || "",
    address: userProfile.address || ""
  });

  useEffect(()=>{
    if (token) {
      fetchUserProfile();
      fetchUserOrders();
    }
  }, [token]);

  useEffect(()=>{
    setFormData({
      name: userProfile.name || "",
      email: userProfile.email || "",
      phone: userProfile.phone || "",
      address: userProfile.address || ""
    });
  },[userProfile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      return toast.error("All fields required");
    }
    saveUserProfile(formData);
    setShowModal(false);
    toast.success("Profile Updated Successfully ✅");
  };

  const handleLogout = () => {
    authLogout();
    setToken("");
    localStorage.removeItem("token");
    toast.info("Logged out successfully");
  };

  const getInitials = () => {
    if (!userProfile.name) return "U";
    return userProfile.name.split(" ").map((n)=>n[0]).join("").toUpperCase().slice(0,2);
  };

  return (
    <div className="bg-gray-50/30 min-h-screen flex flex-col">
      <div className="flex-1 pb-20">
      
      {/* Premium Header Banner */}
      <div className="w-full h-64 bg-gradient-to-r from-[#082e21] via-[#0b3d2c] to-[#082e21] relative overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#ecc153] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 -mt-32 relative z-10">
        
        {userOrders && userOrders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-white p-12 text-center max-w-2xl mx-auto mt-10"
          >
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <span className="text-4xl">🛍️</span>
            </div>
            <h2 className="text-3xl font-serif text-[#082e21] mb-4">Unlock Your Profile</h2>
            <p className="text-gray-500 mb-8 text-lg leading-relaxed">
              Kindly order your fav items and you will be eligible for your profile and view and track your order.
            </p>
            <div className="flex flex-col items-center gap-4">
              <button 
                onClick={() => navigate("/collection")} 
                className="bg-[#082e21] text-[#ecc153] px-10 py-4 rounded-full font-bold hover:bg-[#0b3d2c] transition shadow-lg text-lg"
              >
                Continue Order
              </button>
              
              {!token && (
                <button 
                  onClick={() => navigate("/login")} 
                  className="text-gray-500 hover:text-[#082e21] font-medium transition-colors"
                >
                  Already have an account? Login
                </button>
              )}
            </div>

          </motion.div>
        ) : (
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left Column: Avatar & Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full md:w-1/3"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white p-8 flex flex-col items-center text-center">
              
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#ecc153] to-[#d6a529] p-1 shadow-lg mb-6 relative">
                <div className="w-full h-full rounded-full bg-[#082e21] flex items-center justify-center text-4xl text-white font-serif border-4 border-white">
                  {getInitials()}
                </div>
              </div>

              <h2 className="text-2xl font-serif text-[#082e21] mb-1">{userProfile.name || "Premium User"}</h2>
              <p className="text-sm text-gray-500 mb-6">{userProfile.email || "Add your email"}</p>

              <button 
                onClick={()=>setShowModal(true)} 
                className="w-full bg-[#082e21] hover:bg-[#0b3d2c] text-[#ecc153] font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-lg mb-4"
              >
                Edit Profile
              </button>

              <button 
                onClick={()=>navigate("/orders")} 
                className="w-full bg-[#ecc153]/10 hover:bg-[#ecc153]/20 border border-[#ecc153] text-[#082e21] font-semibold py-3 rounded-xl transition-all mb-4"
              >
                View My Orders
              </button>

              {token ? (
                <button 
                  onClick={handleLogout} 
                  className="w-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-semibold py-3 rounded-xl transition-all"
                >
                  Logout
                </button>
              ) : (
                <button 
                  onClick={() => navigate("/login")} 
                  className="w-full bg-green-50 hover:bg-green-100 border border-[#082e21]/20 text-[#082e21] font-semibold py-3 rounded-xl transition-all"
                >
                  Login
                </button>
              )}

            </div>
          </motion.div>

          {/* Right Column: Details & Information */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full md:w-2/3"
          >
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-12">
              <h3 className="text-2xl font-serif text-[#082e21] mb-8 pb-4 border-b border-gray-100">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Field */}
                <div className="group">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</p>
                  <div className="text-lg text-gray-800 font-medium group-hover:text-[#082e21] transition-colors">
                    {userProfile.name || <span className="text-gray-300 italic">Not provided</span>}
                  </div>
                </div>

                {/* Field */}
                <div className="group">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</p>
                  <div className="text-lg text-gray-800 font-medium group-hover:text-[#082e21] transition-colors">
                    {userProfile.email || <span className="text-gray-300 italic">Not provided</span>}
                  </div>
                </div>

                {/* Field */}
                <div className="group">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phone Number</p>
                  <div className="text-lg text-gray-800 font-medium group-hover:text-[#082e21] transition-colors">
                    {userProfile.phone || <span className="text-gray-300 italic">Not provided</span>}
                  </div>
                </div>

                {/* Field */}
                <div className="group md:col-span-2 mt-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Primary Shipping Address</p>
                  <div className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {userProfile.address || <span className="text-gray-300 italic">No saved address yet. Click Edit Profile to add one.</span>}
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#082e21]/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl relative"
          >
            <button 
              onClick={()=>setShowModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors text-2xl leading-none"
            >
              &times;
            </button>
            
            <h3 className="text-2xl font-serif text-[#082e21] mb-6">Edit Profile</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Name</label>
                <input name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className="w-full border-2 border-gray-100 focus:border-[#ecc153] outline-none p-3 rounded-xl transition-colors" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Email</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className="w-full border-2 border-gray-100 focus:border-[#ecc153] outline-none p-3 rounded-xl transition-colors" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Phone</label>
                <input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+91 9876543210" className="w-full border-2 border-gray-100 focus:border-[#ecc153] outline-none p-3 rounded-xl transition-colors" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Address</label>
                <textarea name="address" value={formData.address} onChange={handleChange} rows="3" placeholder="123 Saree Avenue, City, State, 123456" className="w-full border-2 border-gray-100 focus:border-[#ecc153] outline-none p-3 rounded-xl transition-colors resize-none" />
              </div>
            </div>
            
            <div className="flex justify-end gap-4 mt-8">
              <button onClick={()=>setShowModal(false)} className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-8 py-3 bg-[#082e21] hover:bg-[#0b3d2c] text-[#ecc153] font-bold rounded-xl shadow-lg transition-colors">Save Changes</button>
            </div>
          </motion.div>
        </div>
      )}
      </div>

      <Footer />
    </div>
  );
};

export default MyProfile;