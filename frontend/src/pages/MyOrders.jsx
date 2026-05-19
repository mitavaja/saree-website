import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaBoxOpen } from "react-icons/fa";

const MyOrders = () => {
  const { userOrders, fetchUserOrders, token } = useContext(ShopContext);
  const [activeTab, setActiveTab] = useState("current"); // "current" | "past"
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchUserOrders().finally(() => setLoading(false));
    } else {
      setLoading(false);
      navigate("/login");
    }
  }, [token]);

  // Derived state
  const currentOrders = userOrders.filter(
    (o) => o.status !== "Delivered" && o.status !== "Cancelled"
  );
  const pastOrders = userOrders.filter(
    (o) => o.status === "Delivered" || o.status === "Cancelled"
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "order placed": return "bg-blue-100 text-blue-700";
      case "processing": return "bg-orange-100 text-orange-700";
      case "shipped": return "bg-yellow-100 text-yellow-700";
      case "out for delivery": return "bg-indigo-100 text-indigo-700";
      case "delivered": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusStep = (status) => {
    const s = status?.toLowerCase() || "";
    if (s === "cancelled") return -1;
    if (s.includes("placed")) return 1;
    if (s.includes("process")) return 2;
    if (s.includes("ship")) return 3;
    if (s.includes("out")) return 4;
    if (s.includes("deliver")) return 5;
    return 1;
  };

  const renderOrderCard = (order) => {
    const step = getStatusStep(order.status);
    const orderDate = new Date(order.date);
    const deliveryDate = new Date(order.date);
    deliveryDate.setDate(deliveryDate.getDate() + 7);

    return (
      <motion.div 
        key={order._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-8 mb-8 hover:shadow-xl transition-shadow"
      >
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-100 gap-4">
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Order ID</p>
            <p className="font-serif text-xl text-[#082e21]">#{order._id.slice(-8).toUpperCase()}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Order Date</p>
            <p className="font-medium text-gray-800">{orderDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-[#082e21] uppercase tracking-wider mb-1">Est. Delivery</p>
            <p className="font-bold text-[#ecc153]">{deliveryDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Total Amount</p>
            <p className="font-bold text-2xl text-[#082e21]">₹{order.amount}</p>
          </div>
          <div className="flex flex-col items-end">
            <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
              {order.status || "Pending"}
            </span>
            <button 
              onClick={fetchUserOrders} 
              className="text-xs font-semibold text-gray-400 mt-2 hover:text-[#082e21] flex items-center gap-1 transition-colors"
            >
              <span>↻ Refresh Status</span>
            </button>
          </div>
        </div>

        {/* Tracking Timeline */}
        {order.status !== "Cancelled" && order.status !== "Delivered" && (
          <div className="w-full mb-10 overflow-x-auto py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="min-w-[700px] flex items-center justify-between relative px-6">
              <div className="absolute left-10 right-10 top-1/2 h-1 bg-gray-100 -z-10 -translate-y-1/2 rounded-full"></div>
              <div className={`absolute left-10 top-1/2 h-1 bg-[#082e21] -z-10 -translate-y-1/2 transition-all duration-1000 rounded-full`} style={{ width: `${(step - 1) * 25}%` }}></div>
              
              {["Pending", "Processing", "Shipped", "Out for Delivery", "Delivered"].map((text, i) => (
                <div key={i} className="flex flex-col items-center gap-3 bg-white px-3 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 shadow-sm ${step > i ? 'bg-[#082e21] text-[#ecc153] scale-110' : 'bg-gray-100 text-gray-400'}`}>
                    {step > i ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${step > i ? 'text-[#082e21]' : 'text-gray-400'}`}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {order.items.map((item, index) => (
            <div key={`${item.productId}-${index}`} className="flex items-center gap-4 bg-gray-50 hover:bg-gray-100 transition-colors p-4 rounded-2xl border border-gray-100">
              <div className="w-20 h-20 rounded-xl bg-white overflow-hidden shadow-sm flex-shrink-0">
                <img src={item.image || "https://via.placeholder.com/150"} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800 line-clamp-2">{item.name}</p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100">Qty: {item.quantity}</p>
                  <p className="text-sm font-bold text-[#ecc153]">₹{item.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Payment & Address Info */}
        <div className="bg-gray-50 rounded-2xl p-6 flex flex-col md:flex-row justify-between gap-8 border border-gray-100">
          <div className="text-sm flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-lg">📍</span>
              <p className="text-gray-800 font-bold uppercase tracking-wider text-xs">Shipping Address</p>
            </div>
            <p className="text-gray-800 font-semibold">{order.address?.firstName} {order.address?.lastName}</p>
            <p className="text-gray-600 mt-1">{order.address?.street}</p>
            <p className="text-gray-600">{order.address?.city}, {order.address?.state} {order.address?.zipcode}</p>
            <p className="text-gray-600">Phone: {order.address?.phone}</p>
          </div>
          
          <div className="w-px bg-gray-200 hidden md:block"></div>
          
          <div className="text-sm flex-1 md:text-right flex flex-col justify-center">
            <div className="flex items-center md:justify-end gap-2 mb-3">
              <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-lg">💳</span>
              <p className="text-gray-800 font-bold uppercase tracking-wider text-xs">Payment Details</p>
            </div>
            <div className="flex items-center md:justify-end gap-2 mt-1">
              <p className="text-gray-500">Method:</p>
              <p className="uppercase font-semibold text-gray-800 bg-white px-2 py-0.5 rounded shadow-sm border border-gray-100">{order.paymentMethod}</p>
            </div>
            <div className="flex items-center md:justify-end gap-2 mt-2">
              <p className="text-gray-500">Status:</p>
              <p className={`font-semibold px-2 py-0.5 rounded shadow-sm border ${order.payment ? "bg-green-50 text-green-700 border-green-100" : "bg-orange-50 text-orange-600 border-orange-100"}`}>
                {order.payment ? "Completed" : "Pending"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center bg-gray-50/30"><div className="animate-spin rounded-full h-16 w-16 border-4 border-[#082e21] border-t-[#ecc153]"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <div className="flex-1 pb-20">
      {/* Header */}
      <div className="w-full h-48 bg-gradient-to-r from-[#082e21] via-[#0b3d2c] to-[#082e21] relative overflow-hidden flex items-center">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-1/2 right-10 w-64 h-64 bg-[#ecc153] rounded-full blur-[80px] opacity-20 pointer-events-none -translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 relative z-10">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-2">My <span className="text-[#ecc153]">Orders</span></h1>
          <p className="text-white/80 font-medium">Track, manage and view all your premium saree purchases.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 -mt-8 relative z-20">
        
        {/* Modern Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2 inline-flex gap-2 mb-10">
          <button 
            onClick={() => setActiveTab("current")}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "current" ? "bg-[#082e21] text-[#ecc153] shadow-md" : "text-gray-500 hover:bg-gray-50"}`}
          >
            Current Orders ({currentOrders.length})
          </button>
          <button 
            onClick={() => setActiveTab("past")}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "past" ? "bg-[#082e21] text-[#ecc153] shadow-md" : "text-gray-500 hover:bg-gray-50"}`}
          >
            Past Orders ({pastOrders.length})
          </button>
        </div>

        {/* Orders List */}
        <div>
          {activeTab === "current" && (
            currentOrders.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm">
                <FaBoxOpen className="text-6xl text-gray-300 mb-4" />
                <h2 className="text-2xl font-semibold mb-2">No active orders right now</h2>
                <p className="text-gray-500 mb-6">Find your perfect saree and place an order.</p>
                <button 
                  onClick={() => navigate("/collection")} 
                  className="bg-green-900 text-[#ecc153] px-6 py-3 rounded-md hover:bg-[#0b3d2c] transition font-bold"
                >
                  Explore Products
                </button>
              </motion.div>
            ) : (
              currentOrders.map(renderOrderCard)
            )
          )}

          {activeTab === "past" && (
            pastOrders.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm">
                <FaBoxOpen className="text-6xl text-gray-300 mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Your order history is empty</h2>
                <p className="text-gray-500 mb-6">You haven't received any orders yet.</p>
                <button 
                  onClick={() => navigate("/collection")} 
                  className="bg-green-900 text-[#ecc153] px-6 py-3 rounded-md hover:bg-[#0b3d2c] transition font-bold"
                >
                  Explore Products
                </button>
              </motion.div>
            ) : (
              pastOrders.map(renderOrderCard)
            )
          )}
        </div>
      </div>
    </div>
    <Footer />
  </div>
  );
};

export default MyOrders;