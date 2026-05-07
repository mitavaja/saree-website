import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../components/ProductItem";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

const Wishlist = () => {

  const { products, wishlistItems } = useContext(ShopContext);
  const navigate = useNavigate();

  const wishlistProducts = products.filter(
    (item) => wishlistItems[item._id]
  );

  return (
    <>
      <div className="px-6 lg:px-12 py-10 min-h-[70vh]">

        {wishlistProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center h-[60vh]">

            <FaHeart className="text-6xl text-gray-300 mb-4" />

            <h2 className="text-2xl font-semibold mb-2">
              Your Wishlist is Empty
            </h2>

            <p className="text-gray-500 mb-6">
              Save items you love to your wishlist and find them easily later.
            </p>

            <button
              onClick={() => navigate("/collection")}
              className="bg-green-900 text-white px-6 py-3 rounded-md hover:bg-green-800 transition"
            >
              Explore Products
            </button>

          </div>
        ) : (
          <>
            <h1 className="text-3xl font-semibold mb-8 text-[#082e21]">
              My Wishlist
            </h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {wishlistProducts.map((item, index) => (
                <ProductItem
                  key={index}
                  id={item._id}
                  image={item.image}
                  name={item.name}
                  price={item.price}
                />
              ))}
            </div>
          </>
        )}

      </div>

      <Footer />
    </>
  );
};

export default Wishlist;