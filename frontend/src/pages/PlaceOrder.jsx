import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

const PlaceOrder = () => {

  const {
    cartItems,
    setCartItems,
    products,
    delivery_fee, // (not used now, but kept as-is)
    currency,
    removeFromCart,
    addToCart,
    fetchUserOrders,
    token,
    setToken,
    fetchUserProfile
  } = useContext(ShopContext);

  const navigate = useNavigate();

  const [address, setAddress] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    pincode: "",
    address: "",
  });

  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [stateSearch, setStateSearch] = useState("");

  // ✅ NEW: dynamic delivery fee
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const cartProductIds = Object.keys(cartItems);

  // ✅ AUTO REDIRECT WHEN CART EMPTY
  useEffect(() => {
    if (cartProductIds.length === 0) {
      navigate("/collection");
    }
  }, [cartProductIds, navigate]);

  // ✅ FETCH DELIVERY FEE BASED ON STATE
  useEffect(() => {
    const fetchFee = async () => {
      if (address.state) {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/delivery/${address.state}`
          );

          if (res.data.success) {
            setDeliveryFee(res.data.fee);
          } else {
            setDeliveryFee(0);
          }
        } catch (error) {
          setDeliveryFee(0);
        }
      } else {
        setDeliveryFee(0);
      }
    };

    fetchFee();
  }, [address.state]);

  const subtotal = cartProductIds.reduce((total, id) => {
    const product = products.find((p) => p._id === id);
    if (!product) return total;
    return total + product.price * cartItems[id];
  }, 0);

  // ✅ UPDATED TOTAL
  const total = subtotal + deliveryFee;

  // ✅ DECREASE QTY FUNCTION
  const decreaseQty = (id) => {
    if (cartItems[id] > 1) {
      addToCart(id, -1);
    } else {
      removeFromCart(id);
    }
  };

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];

  const validatePhone = (phone) => {
    return /^\d{10}$/.test(phone);
  };

  const placeOrder = async () => {

    if (
      !address.name ||
      !address.email ||
      !address.phone ||
      !address.city ||
      !address.state ||
      !address.pincode ||
      !address.address
    ) {
      toast.error("Please fill all fields");
      return;
    }

    if (!validatePhone(address.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    const orderData = {
      items: cartItems,
      amount: total,
      deliveryFee, // ✅ send correct fee
      address,
      paymentMethod: "COD",
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/order/place",
        orderData,
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("Order Placed Successfully 🎉");
        
        if (res.data.token) {
          setToken(res.data.token);
          localStorage.setItem("token", res.data.token);
        }
        if (res.data.userId) {
          localStorage.setItem("userId", res.data.userId);
        }

        setCartItems({});
        localStorage.removeItem("cartItems");
        fetchUserOrders?.();
        fetchUserProfile?.();
        navigate("/profile");
      } else {
        toast.error("Order Failed");
      }

    } catch (error) {
      toast.error("Server Error");
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const payOnline = async () => {
    if (
      !address.name ||
      !address.email ||
      !address.phone ||
      !address.city ||
      !address.state ||
      !address.pincode ||
      !address.address
    ) {
      toast.error("Please fill all fields");
      return;
    }

    if (!validatePhone(address.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      const orderData = {
        items: cartItems,
        amount: total,
        deliveryFee,
        address,
        paymentMethod: "ONLINE",
      };

      const res = await axios.post(
        "http://localhost:5000/api/order/create-payment",
        orderData,
        { headers: { token } }
      );

      if (!res.data.success) {
        toast.error(res.data.message || "Payment initialization failed");
        return;
      }

      // set token if returned (auto-login)
      if (res.data.token) {
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
      }

      const { razorpayOrder, key, order } = res.data;

      const ok = await loadRazorpayScript();
      if (!ok) {
        toast.error("Failed to load Razorpay SDK");
        return;
      }

      const options = {
        key: key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Saree Web",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              "http://localhost:5000/api/order/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order._id,
              },
              { headers: { token: localStorage.getItem("token") || token } }
            );

            if (verifyRes.data.success) {
              toast.success("Payment successful and order placed 🎉");

              setCartItems({});
              localStorage.removeItem("cartItems");
              fetchUserOrders?.();
              fetchUserProfile?.();
              navigate("/profile");
            } else {
              toast.error(verifyRes.data.message || "Payment verification failed");
            }
          } catch (err) {
            toast.error("Verification error");
          }
        },
        prefill: {
          name: address.name,
          email: address.email,
          contact: address.phone,
        },
        notes: {
          orderId: order._id,
        },
        theme: {
          color: "#082e21",
        },
        // Attempt to hide wallet and pay-later options in checkout
        method: {
          wallet: false,
          paylater: false,
          card: true,
          netbanking: true,
          upi: true,
          emi: false,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      toast.error("Server Error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      <div className="grid lg:grid-cols-2 gap-10">

        {/* LEFT FORM */}
        <div>

          <h2 className="text-2xl font-semibold mb-6">
            Delivery Information
          </h2>

          <input
            name="name"
            placeholder="Full Name"
            value={address.name}
            onChange={handleChange}
            className="border p-2 w-full mb-3"
          />

          <input
            name="email"
            placeholder="Email"
            value={address.email}
            onChange={handleChange}
            className="border p-2 w-full mb-3"
          />

          <input
            name="phone"
            placeholder="Phone (10 Digits)"
            value={address.phone}
            onChange={handleChange}
            maxLength={10}
            className="border p-2 w-full mb-3"
          />

          <textarea
            name="address"
            placeholder="Full Address"
            value={address.address}
            onChange={handleChange}
            className="border p-2 w-full mb-3"
          />

          <div className="grid grid-cols-2 gap-3">

            <input
              name="city"
              placeholder="City"
              value={address.city}
              onChange={handleChange}
              className="border p-2"
            />

            <div className="relative">
              <input
                name="state"
                placeholder="State"
                autoComplete="off"
                onFocus={() => setShowStateDropdown(true)}
                value={address.state}
                onChange={(e) => {
                  setAddress({ ...address, state: e.target.value });
                  setStateSearch(e.target.value);
                  setShowStateDropdown(true);
                }}
                className="border-2 border-gray-100 p-2 w-full focus:border-[#ecc153] outline-none transition-colors"
              />
              {showStateDropdown && (
                <div className="absolute top-full left-0 w-full bg-white border border-gray-200 shadow-xl z-50 max-h-60 overflow-y-auto mt-1 rounded-b-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                  {indianStates
                    .filter((s) =>
                      s.toLowerCase().includes(address.state.toLowerCase())
                    )
                    .map((state) => (
                      <div
                        key={state}
                        onClick={() => {
                          setAddress({ ...address, state: state });
                          setShowStateDropdown(false);
                        }}
                        className="px-4 py-3 hover:bg-[#082e21]/5 cursor-pointer text-sm font-medium border-b border-gray-50 last:border-none transition-colors hover:text-[#082e21]"
                      >
                        {state}
                      </div>
                    ))}
                  {indianStates.filter((s) =>
                    s.toLowerCase().includes(address.state.toLowerCase())
                  ).length === 0 && (
                    <div className="px-4 py-3 text-gray-400 text-xs italic">
                      No matching states found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Click outside to close */}
            {showStateDropdown && (
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowStateDropdown(false)}
              ></div>
            )}
          </div>

          <input
            name="pincode"
            placeholder="Pincode"
            value={address.pincode}
            onChange={handleChange}
            className="border p-2 w-full mt-3"
          />

          <div className="mt-4">
            <label className="inline-flex items-center mr-4">
              <input
                type="radio"
                name="payment"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
                className="mr-2"
              />
              Cash on Delivery
            </label>

            <label className="inline-flex items-center">
              <input
                type="radio"
                name="payment"
                value="ONLINE"
                checked={paymentMethod === "ONLINE"}
                onChange={() => setPaymentMethod("ONLINE")}
                className="mr-2"
              />
              Pay Online
            </label>

            {paymentMethod === "COD" ? (
              <button
                onClick={placeOrder}
                className="w-full mt-6 bg-green-900 text-white py-3 rounded"
              >
                Place COD Order
              </button>
            ) : (
              <button
                  onClick={payOnline}
                  className="w-full mt-6  bg-green-900 text-white py-3 rounded-lg shadow-md"
                >
                  Pay Online
                </button>
            )}
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div>

          <h2 className="text-2xl font-semibold mb-6">
            Order Summary
          </h2>

          {cartProductIds.map((id) => {

            const product = products.find((p) => p._id === id);
            if (!product) return null;

            return (

              <div
                key={id}
                className="flex items-center justify-between border-b py-4"
              >

                <div className="flex items-center gap-4">

                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />

                  <div>
                    <p className="font-medium">{product.name}</p>

                    <div className="flex items-center gap-3 mt-1">

                      <button
                        onClick={() => decreaseQty(id)}
                        className="px-2 bg-gray-200 rounded"
                      >
                        -
                      </button>

                      <span>{cartItems[id]}</span>

                      <button
                        onClick={() => addToCart(id, 1)}
                        className="px-2 bg-gray-200 rounded"
                      >
                        +
                      </button>

                    </div>

                    <p className="text-sm text-gray-500">
                      {currency}{product.price} each
                    </p>
                  </div>

                </div>

                <div className="flex items-center gap-4">

                  <p className="font-medium">
                    {currency}{product.price * cartItems[id]}
                  </p>

                  <FaTrash
                    className="text-red-500 cursor-pointer"
                    onClick={() => removeFromCart(id)}
                  />

                </div>

              </div>

            );
          })}

          <div className="mt-6 border-t pt-4">

            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>{currency}{subtotal}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span>Delivery</span>
              <span>{currency}{deliveryFee}</span>
            </div>

            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{currency}{total}</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default PlaceOrder;