import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { FaHeart, FaStar } from "react-icons/fa";
import { toast } from "react-toastify";

const ProductItem = ({ id, image, name, price, category, rating = 4 }) => {
    const { currency, addToWishlist, wishlistItems } = useContext(ShopContext);

    const isWishlisted = wishlistItems[id];

    const handleWishlist = () => {
        addToWishlist(id);

        if (!isWishlisted) {
            toast.success("Added to wishlist ❤️");
        } else {
            toast.info("Removed from wishlist");
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden group">
            
            {/* Image */}
            <Link to={`/product/${id}`} className="block overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-40 sm:h-56 md:h-64 object-cover group-hover:scale-110 transition duration-300"
                />
            </Link>

            <div className="p-3 sm:p-4">
                
                {/* Category */}
                <p className="text-xs text-gray-400 uppercase tracking-wide">{category}</p>

                {/* Name */}
                <Link to={`/product/${id}`}>
                    <p className="text-xs sm:text-sm font-semibold mt-1 text-gray-800 line-clamp-2 hover:text-pink-600">
                        {name}
                    </p>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-2 text-yellow-500 text-xs">
                    {[...Array(rating)].map((_, i) => <FaStar key={i} />)}
                    <span className="text-gray-500 ml-1">({rating}.0)</span>
                </div>

                {/* Bottom Row */}
                <div className="flex items-center justify-between mt-3">
                    
                    {/* Price */}
                    <p className="text-sm sm:text-base font-bold text-gray-900">
                        {currency}{price}
                    </p>

                    {/* Wishlist */}
                    <button
                        onClick={handleWishlist}
                        className="bg-gray-100 p-1.5 sm:p-2 rounded-full hover:bg-pink-100 transition"
                    >
                        <FaHeart
                            className={`text-base sm:text-lg ${isWishlisted ? "text-red-500" : "text-gray-400"}`}
                        />
                    </button>

                </div>
            </div>
        </div>
    );
};

export default ProductItem;