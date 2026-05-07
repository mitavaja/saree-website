import React, { useState, useEffect, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const { banners } = useContext(ShopContext);
  const [current, setCurrent] = useState(0);
  const [zoom, setZoom] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (banners.length ? (prev + 1) % banners.length : 0));
      setZoom((z) => !z); // toggle zoom
    }, 5000);

    return () => clearInterval(interval);
  }, [banners]);

  if (!banners.length) return null;

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    setZoom((z) => !z);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    setZoom((z) => !z);
  };

  const slide = banners[current];

  return (
    
    <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden">
      <div className="absolute inset-0 transition-opacity duration-1000 opacity-100 z-10">
        <img
          src={`http://localhost:5000${slide.image}`}
          alt={slide.title}
          className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-linear ${
            zoom ? "scale-110" : "scale-100"
          }`}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#082e21]/90 via-[#082e21]/70 to-transparent"></div>

        {/* CENTER CONTENT */}
        <div className="absolute inset-0 flex items-center justify-center text-center z-20 px-6">
          <div className="text-white max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-serif mb-4 leading-tight">
              {slide.title}
            </h2>
            <p className="text-lg md:text-2xl mb-6 text-[#ecc153]">
              {slide.subtitle}
            </p>

            <button
              onClick={() => navigate("/collection")}
              className="relative overflow-hidden bg-[#ecc153] text-[#082e21] px-8 py-3 font-semibold group"
            >
              <span className="relative z-10">{slide.buttonText}</span>
              <span className="absolute top-0 left-[-75%] w-1/2 h-full bg-white/30 skew-x-12 group-hover:left-[125%] transition-all duration-700"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-[#082e21]/80 hover:bg-[#082e21] text-[#ecc153] px-4 py-2 rounded-full text-2xl transition"
      >
        ‹
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-[#082e21]/80 hover:bg-[#082e21] text-[#ecc153] px-4 py-2 rounded-full text-2xl transition"
      >
        ›
      </button>
    </div>
  );
};

export default Hero;