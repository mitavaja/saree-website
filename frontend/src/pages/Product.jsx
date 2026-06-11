import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../components/ProductItem";
import { toast } from "react-toastify";

const Product = () => {

  const { productId } = useParams();
  const navigate = useNavigate();

  const { products, currency, addToCart, addToWishlist, wishlistItems } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [qty, setQty] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [activeImage, setActiveImage] = useState("");
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {

    const product = products.find((item) => item._id === productId);

    if (product) {

      setProductData(product);

      setActiveImage(product.image);
      setShowVideo(false);

      const related = products.filter(
        (item) =>
          item.category === product.category &&
          item._id !== product._id
      );

      setRelatedProducts(related.slice(0, 5));
    }

  }, [productId, products]);

  const handleAddToCart = () => {
    addToCart(productData._id, qty);

    if (qty > 1) {
      toast.success(`${qty} items added to cart 🛒`);
    } else {
      toast.success("Product added to cart 🛒");
    }
  };

  const handleWishlist = () => {
    addToWishlist(productData._id);
    toast.success("Added to wishlist ❤️");
  };

  const isWishlisted = wishlistItems[productData?._id];

  if (!productData) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (

    <div className="border-t pt-6 sm:pt-10 px-4 sm:px-6 lg:px-20">

      {/* PRODUCT SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

        {/* LEFT SIDE */}
        <div className="flex flex-col-reverse sm:flex-row gap-4 w-full">

          {/* THUMBNAILS */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0 scrollbar-none">

            <img
              src={productData.image}
              onClick={() => {
                setActiveImage(productData.image);
                setShowVideo(false);
              }}
              className={`w-16 h-16 object-cover border cursor-pointer ${activeImage === productData.image && !showVideo ? "border-black" : ""}`}
              alt=""
            />

            {productData.images?.slice(0, 3).map((img, index) => (
              <img
                key={index}
                src={img}
                onClick={() => {
                  setActiveImage(img);
                  setShowVideo(false);
                }}
                className={`w-16 h-16 object-cover border cursor-pointer ${activeImage === img ? "border-black" : ""}`}
                alt=""
              />
            ))}

            {productData.video && (
              <div
                onClick={() => setShowVideo(true)}
                className={`w-16 h-16 flex items-center justify-center border cursor-pointer ${showVideo ? "border-black" : ""}`}
              >
                ▶️
              </div>
            )}

          </div>

          {/* MAIN DISPLAY */}
          <div className="flex-1">
            <div className="overflow-hidden rounded-lg">

              {!showVideo ? (
                <img
                  src={activeImage}
                  className="w-full sm:max-w-md h-[300px] sm:h-[450px] object-cover hover:scale-105 transition rounded-lg"
                  alt=""
                />
              ) : (
                <video
                  src={productData.video}
                  controls
                  className="w-full sm:max-w-md h-[300px] sm:h-[450px] object-cover rounded-lg"
                />
              )}

            </div>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:pl-4">

          {/* TITLE */}
          <h1 className="text-2xl sm:text-3xl font-semibold mb-4 text-[#082e21]">
            {productData.name}
          </h1>

          <div className="flex items-center gap-1 mb-3">
            <span className="text-yellow-500 text-lg">★★★★★</span>
            <p className="text-gray-500 text-sm">(120 Reviews)</p>
          </div>

          {/* DESCRIPTION */}
          <p className="text-gray-600 mb-4">
            {productData.description}
          </p>

          {/* PRICE */}
          <p className="text-2xl font-bold text-[#082e21] mb-6">
            {currency}{productData.price}
          </p>

          {/* FEATURES */}
          <ul className="text-sm text-gray-600 mb-6 list-disc ml-5 space-y-1">
            {productData.features?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          {/* QUANTITY */}
          <div className="flex items-center gap-4 mb-6">

            <button
              onClick={() => qty > 1 && setQty(qty - 1)}
              className="border px-3 py-1 rounded"
            >
              -
            </button>

            <span className="px-4 font-semibold">
              {qty}
            </span>

            <button
              onClick={() => setQty(qty + 1)}
              className="border px-3 py-1 rounded"
            >
              +
            </button>

          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 mb-6">

            <button
              onClick={handleAddToCart}
              className="bg-[#082e21] text-white px-6 py-3 rounded hover:bg-[#0d4633]"
            >
              Add To Cart
            </button>

            <button
              onClick={() => {
                addToCart(productData._id, qty);
                navigate("/place-order");
              }}
              className="border border-[#082e21] text-[#082e21] px-6 py-3 rounded hover:bg-[#082e21] hover:text-white"
            >
              Buy Now
            </button>

          </div>

          {/* WISHLIST */}
          <button
            onClick={handleWishlist}
            className="flex items-center gap-2 text-lg"
          >
            <span className={`text-2xl ${isWishlisted ? "text-red-500" : "text-gray-400"}`}>
              {isWishlisted ? "❤️" : "🤍"}
            </span>

            <span className={isWishlisted ? "text-red-500" : "text-gray-600"}>
              {isWishlisted ? "Added to Wishlist" : "Add to Wishlist"}
            </span>
          </button>

        </div>

      </div>

      {/* RELATED PRODUCTS */}
      <div className="mt-20">

        <h2 className="text-2xl font-semibold text-center mb-8">
          Related Products
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">

          {relatedProducts.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
            />
          ))}

        </div>

      </div>

    </div>
  );
};

export default Product;