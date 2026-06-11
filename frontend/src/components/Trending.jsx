import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api";
const UPLOADS_URL = "http://localhost:5000/uploads";

const Trending = () => {
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API}/trending`);
        setItems(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🔥 AUTO SLIDE
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || items.length === 0) return;

    let raf;
    let isHovered = false;

    const handleMouseEnter = () => (isHovered = true);
    const handleMouseLeave = () => (isHovered = false);
    const handleTouchStart = () => (isHovered = true);
    const handleTouchEnd = () => {
      isHovered = false;
    };

    slider.addEventListener("mouseenter", handleMouseEnter);
    slider.addEventListener("mouseleave", handleMouseLeave);
    slider.addEventListener("touchstart", handleTouchStart, { passive: true });
    slider.addEventListener("touchend", handleTouchEnd, { passive: true });

    const animate = () => {
      if (!isHovered) {
        slider.scrollLeft += 1;

        if (slider.scrollLeft >= slider.scrollWidth / 2) {
          slider.scrollLeft -= slider.scrollWidth / 2;
        }
      }
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      slider.removeEventListener("mouseenter", handleMouseEnter);
      slider.removeEventListener("mouseleave", handleMouseLeave);
      slider.removeEventListener("touchstart", handleTouchStart);
      slider.removeEventListener("touchend", handleTouchEnd);
    };
  }, [items]);

  if (loading) {
    return (
      <section className="w-full py-10 text-center bg-white">
        <p className="text-[#082e21] animate-pulse font-medium">Loading Trending Items...</p>
      </section>
    );
  }

  if (items.length === 0) return null;

  const displayItems = [...items, ...items, ...items, ...items];

  return (
    <section className="w-full py-0 bg-white relative overflow-hidden border-t border-[#082e21]/5">

      {/* 🔥 Subtle Background Accents */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-[#082e21] rounded-full blur-[150px] opacity-[0.02] pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-[#082e21] rounded-full blur-[150px] opacity-[0.03] pointer-events-none"></div>

      <div className="relative z-10 w-full overflow-hidden px-4 md:px-8">
        <div
          ref={sliderRef}
          className="flex gap-6 sm:gap-10 overflow-x-auto scrollbar-none md:overflow-x-hidden cursor-grab active:cursor-grabbing pb-4 pt-2"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {displayItems.map((item, index) => (
            <div
              key={`${item._id}-${index}`}
              onClick={() => navigate("/collection")}
              className="flex-shrink-0 group flex flex-col items-center gap-2 py-1"
            >
              {/* 🔥 PREMIUM CIRCLE CARD */}
              <div className="relative w-[80px] h-[80px] sm:w-[110px] sm:h-[110px] rounded-full bg-white shadow-[0_8px_30px_rgba(0,0,0,0.03)] group-hover:shadow-[0_15px_40px_rgba(8,46,33,0.15)] transition-all duration-500 ease-out">

                {/* Border Ring */}
                <div className="absolute inset-0 rounded-full border-[1.5px] border-[#082e21]/20 group-hover:border-[#082e21] scale-100 group-hover:scale-105 transition-all duration-500 z-20 pointer-events-none"></div>

                {/* Inner White BG to ensure border separates */}
                <div className="absolute inset-[4px] sm:inset-[5px] rounded-full bg-white z-0 overflow-hidden shadow-inner">
                  {/* IMAGE */}
                  <img
                    src={
                      item.image.startsWith("http") || item.image.startsWith("/")
                        ? item.image
                        : `${UPLOADS_URL}/${item.image}`
                    }
                    alt={item.name || "Trending Saree"}
                    className="w-full h-full object-cover rounded-full z-10 
                    group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                </div>

                {/* Subtle dark overlay on hover */}
                <div className="absolute inset-[4px] sm:inset-[5px] rounded-full bg-[#082e21]/0 group-hover:bg-[#082e21]/10 transition-colors duration-500 z-10 pointer-events-none"></div>

              </div>
              
              {/* Optional: Title under the image for a more complete look */}
              {item.name && (
                <p className="text-[10px] sm:text-xs font-semibold text-[#082e21] opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-1 group-hover:translate-y-0 text-center w-[90px] sm:w-[120px] truncate">
                  {item.name}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Trending;