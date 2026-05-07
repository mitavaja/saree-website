import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Footer from "../components/Footer";
import { FaShoppingCart, FaTrash } from "react-icons/fa";

const Cart = () => {

  const {
    cartItems,
    products,
    currency,
    delivery_fee,
    removeFromCart,
    addToCart   // ✅ needed for +
  } = useContext(ShopContext);

  const navigate = useNavigate();

  const cartProductIds = Object.keys(cartItems);

  const subtotal = cartProductIds.reduce((total, itemId) => {
    const product = products.find((p) => p._id === itemId);
    if (product) {
      total += product.price * cartItems[itemId];
    }
    return total;
  }, 0);

  const total = subtotal + delivery_fee;

  return (
    <>
      <div className="max-w-5xl mx-auto p-6 min-h-[70vh]">

        {cartProductIds.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center h-[60vh]">

            <FaShoppingCart className="text-6xl text-gray-300 mb-4" />

            <h2 className="text-2xl font-semibold mb-2">
              Your Cart is Empty
            </h2>

            <p className="text-gray-500 mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>

            <button
              onClick={() => navigate("/collection")}
              className="bg-green-900 text-white px-6 py-3 rounded-md hover:bg-green-800 transition"
            >
              Continue Shopping
            </button>

          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-6">
              Your Cart
            </h2>

            {cartProductIds.map((itemId) => {

              const product = products.find((p) => p._id === itemId);
              if (!product) return null;

              return (
                <div
                  key={itemId}
                  className="flex justify-between items-center border-b py-4"
                >

                  {/* LEFT */}
                  <div className="flex items-center gap-4">

                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover"
                    />

                    <div>
                      <p className="font-medium">{product.name}</p>

                      <p className="text-sm text-gray-500">
                        {currency}{product.price}
                      </p>
                    </div>

                  </div>

                  {/* QTY CONTROLS */}
                  <div className="flex items-center gap-2">

                    {/* - BUTTON */}
                    <button
                      onClick={() => {
                        if (cartItems[itemId] > 1) {
                          removeFromCart(itemId);
                        } else {
                          removeFromCart(itemId);
                        }
                      }}
                      className="px-2 py-1 border rounded"
                    >
                      -
                    </button>

                    <span>{cartItems[itemId]}</span>

                    {/* + BUTTON */}
                    <button
                      onClick={() => addToCart(itemId)}
                      className="px-2 py-1 border rounded"
                    >
                      +
                    </button>

                  </div>

                  {/* PRICE */}
                  <div className="font-semibold">
                    {currency}{product.price * cartItems[itemId]}
                  </div>

                  {/* DELETE */}
                  <button
                    onClick={() => removeFromCart(itemId)}
                    className="text-red-600 hover:text-red-800 text-lg"
                  >
                    <FaTrash />
                  </button>

                </div>
              );
            })}

            <div className="mt-8 border-t pt-4">

              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>{currency}{subtotal}</span>
              </div>

              <div className="flex justify-between mb-2">
                <span>Delivery Fee</span>
                <span>{currency}{delivery_fee}</span>
              </div>

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{currency}{total}</span>
              </div>

              <button
                onClick={() => navigate("/place-order")}
                className="w-full mt-6 bg-green-900 text-white py-3 rounded-md hover:bg-green-800"
              >
                Proceed To Checkout
              </button>

            </div>
          </>
        )}

      </div>

      <Footer />
    </>
  );
};

export default Cart;