import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../components/ProductItem";
import Footer from "../components/Footer";

const Collection = () => {
  const { products } = useContext(ShopContext);

  const [category, setCategory] = useState("All");
  const [color, setColor] = useState("All");
  const [priceRange, setPriceRange] = useState(10000);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);

  const categories = ["All", ...new Set(products.map((item) => item.category))];
  const colors = ["All", ...new Set(products.map((item) => item.color))];

  useEffect(() => {
    let filtered = products;

    if (category !== "All") {
      filtered = filtered.filter((item) => item.category === category);
    }

    if (color !== "All") {
      filtered = filtered.filter((item) => item.color === color);
    }

    filtered = filtered.filter((item) => item.price <= priceRange);

    setFilteredProducts(filtered);
  }, [category, color, priceRange, products]);

  const colorMap = {
    Red: "bg-red-500", Blue: "bg-blue-500", Green: "bg-green-500",
    Black: "bg-black", Pink: "bg-pink-400", Yellow: "bg-yellow-400",
    Purple: "bg-purple-500", Orange: "bg-orange-400", 
    White: "bg-white border border-gray-400", Maroon: "bg-red-800",
    Cream: "bg-yellow-100 border border-gray-300", Gold: "bg-yellow-500",
    Silver: "bg-gray-300", Brown: "bg-amber-800"
  };

  const FilterContent = ({ isMobile }) => (
    <div className={`bg-[#082e21] text-white p-6 md:p-8 rounded-3xl shadow-xl ${isMobile ? "h-full overflow-y-auto" : "sticky top-28"}`}>
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl md:text-2xl font-serif text-[#ecc153]">
          Refine By
        </h3>
        {isMobile && (
           <button onClick={() => setOpenFilter(false)} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
        )}
      </div>

      {/* CATEGORY */}
      <div className="mb-10">
        <h4 className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-4">
          Category
        </h4>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                category === cat
                  ? "bg-[#ecc153] text-[#082e21] shadow-[0_0_15px_rgba(236,193,83,0.4)]"
                  : "bg-white/5 text-gray-300 hover:bg-white/10 border border-transparent hover:border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* COLOR FILTER */}
      <div className="mb-10">
        <h4 className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-6">
          Shop by Color
        </h4>
        <div className="flex gap-3 flex-wrap">
          {colors.map((c, index) => (
            <div key={index} className="group/color flex flex-col items-center">
              <button
                onClick={() => setColor(c)}
                title={c}
                className={`relative w-7 h-7 rounded-full transition-all duration-500 hover:scale-125
                ${colorMap[c] || "bg-gray-300"}
                ${
                  color === c
                    ? "ring-2 ring-[#082e21] ring-offset-2 scale-110 shadow-lg"
                    : "border border-black/5"
                }`}
              >
                {color === c && (
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] drop-shadow-md mix-blend-difference text-white">
                    ✓
                  </span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* PRICE SLIDER */}
      <div>
        <h4 className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-4">
          Max Price
        </h4>
        <div className="px-2">
          <input
            type="range"
            min="1000"
            max="10000"
            step="500"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#ecc153]"
          />
          <div className="flex justify-between mt-4 text-sm font-medium">
            <span className="text-gray-400">₹1000</span>
            <span className="text-[#ecc153] text-xl font-bold">₹{priceRange}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      
      {/* Premium Header Banner */}
      <div className="w-full h-64 md:h-80 bg-gradient-to-r from-[#082e21] via-[#0b3d2c] to-[#082e21] relative overflow-hidden flex items-center justify-center shadow-2xl">
        {/* Decor */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <div className="relative z-10 text-center px-6">
          <span className="text-[#ecc153] uppercase tracking-[0.4em] text-sm font-bold mb-4 block">Premium Heritage</span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 tracking-tight drop-shadow-2xl">
            Our <span className="text-[#ecc153] italic">Collection</span>
          </h1>
          <div className="w-32 h-1 bg-[#ecc153] mx-auto rounded-full"></div>
        </div>
      </div>

      <div className="w-full px-6 lg:px-12 py-12 md:py-20">
        
        {/* Mobile Filter Toggle */}
        <div className="md:hidden flex justify-between items-center mb-10 bg-[#082e21]/5 p-6 rounded-[2rem] border border-[#082e21]/10">
          <div className="flex flex-col">
            <p className="text-[#082e21] font-serif text-xl">Filters</p>
            <p className="text-gray-500 text-xs uppercase tracking-widest">{filteredProducts.length} items found</p>
          </div>
          <button
            onClick={() => setOpenFilter(true)}
            className="flex items-center gap-3 px-6 py-3 bg-[#082e21] hover:bg-[#0b3d2c] text-[#ecc153] rounded-2xl font-bold shadow-lg transition-all active:scale-95"
          >
            <span>Refine</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden md:block w-[320px] flex-shrink-0">
            <FilterContent isMobile={false} />
          </div>

          {/* Product Grid Area */}
          <div className="flex-1">
            <div className="hidden md:flex justify-between items-center mb-12 pb-6 border-b-2 border-gray-100">
              <h2 className="text-3xl font-serif text-[#082e21]">Discover <span className="text-[#ecc153]">Elegance</span></h2>
              <p className="text-gray-400 font-medium text-sm tracking-widest uppercase">Showing {filteredProducts.length} premium products</p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl mb-8">
                  <span className="text-4xl">🔍</span>
                </div>
                <p className="text-[#082e21] text-2xl font-serif mb-2">No sarees found</p>
                <p className="text-gray-400 mb-10">Try adjusting your filters to find your perfect match.</p>
                <button 
                  onClick={() => { setCategory("All"); setColor("All"); setPriceRange(10000); }}
                  className="px-10 py-4 bg-[#082e21] hover:bg-[#0b3d2c] text-[#ecc153] rounded-2xl font-bold shadow-xl transition-all hover:-translate-y-1 active:scale-95"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-10">
                  {filteredProducts.map((item) => (
                    <div key={item._id} className="h-full">
                      <ProductItem
                        id={item._id}
                        image={item.image}
                        name={item.name}
                        price={item.price}
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {openFilter && (
        <>
          <div 
            className="fixed inset-0 z-[1000] bg-[#082e21]/80"
            onClick={() => setOpenFilter(false)}
          />
          <div 
            className="fixed inset-y-0 right-0 z-[1001] w-full max-w-[400px] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] bg-white animate-slide-in-right"
          >
            <FilterContent isMobile={true} />
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};

export default Collection;