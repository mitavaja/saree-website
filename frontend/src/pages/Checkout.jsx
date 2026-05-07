import React, { useState, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Checkout = () => {

  const {
    cartItems,
    setCartItems,
    products,
    currency,
    delivery_fee,
    setToken,
    fetchUserOrders,
    fetchUserProfile,
    token
  } = useContext(ShopContext);

  const navigate = useNavigate();

  const [address, setAddress] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    pincode: "",
    address: ""
  });

  const cartProductIds = Object.keys(cartItems);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleQuantityChange = (itemId, delta) => {

    setCartItems((prev) => {

      const qty = prev[itemId] + delta;

      if (qty <= 0) {
        const updated = { ...prev };
        delete updated[itemId];
        return updated;
      }

      return { ...prev, [itemId]: qty };
    });
  };

  const removeItem = (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      delete updated[itemId];
      return updated;
    });
  };

  const subtotal = cartProductIds.reduce((total, id) => {

    const product = products.find((p) => p._id === id);

    if (!product) return total;

    return total + product.price * cartItems[id];

  }, 0);

  const total = subtotal + delivery_fee;

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

    const orderData = {
      items: cartItems,
      amount: total,
      address,
      paymentMethod: "COD"
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

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      <div className="grid lg:grid-cols-2 gap-10">

        {/* LEFT SIDE FORM */}

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
            placeholder="Phone"
            value={address.phone}
            onChange={handleChange}
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

            <input
              name="state"
              placeholder="State"
              value={address.state}
              onChange={handleChange}
              className="border p-2"
            />

          </div>

          <input
            name="pincode"
            placeholder="Pincode"
            value={address.pincode}
            onChange={handleChange}
            className="border p-2 w-full mt-3"
          />

          <button
            onClick={placeOrder}
            className="w-full mt-6 bg-green-900 text-white py-3 rounded"
          >
            Place COD Order
          </button>

        </div>

        {/* RIGHT SIDE CART */}

        <div>

          <h2 className="text-2xl font-semibold mb-6">
            Your Order
          </h2>

          {cartProductIds.length === 0 && (
            <p>Your cart is empty</p>
          )}

          {cartProductIds.map((itemId) => {

            const product = products.find((p) => p._id === itemId);

            if (!product) return null;

            return (

              <div
                key={itemId}
                className="flex items-center gap-4 border-b py-4"
              >

                <img
                  src={product.image}
                  alt=""
                  className="w-16 h-16 object-cover"
                />

                <div className="flex-1">

                  <p className="font-medium">
                    {product.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {currency}{product.price}
                  </p>

                </div>

                {/* Qty */}

                <div className="flex items-center gap-2">

                  <button
                    onClick={() => handleQuantityChange(itemId, -1)}
                    className="border px-2"
                  >
                    -
                  </button>

                  <span>{cartItems[itemId]}</span>

                  <button
                    onClick={() => handleQuantityChange(itemId, 1)}
                    className="border px-2"
                  >
                    +
                  </button>

                </div>

                <p className="font-medium">
                  {currency}{product.price * cartItems[itemId]}
                </p>

                <button
                  onClick={() => removeItem(itemId)}
                  className="text-red-600"
                >
                  <FaTrash />
                </button>

              </div>

            );
          })}

          {/* TOTAL */}

          <div className="mt-6 border-t pt-4">

            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>{currency}{subtotal}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span>Delivery</span>
              <span>{currency}{delivery_fee}</span>
            </div>

            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{currency}{total}</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Checkout;