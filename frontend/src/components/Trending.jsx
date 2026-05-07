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

    slider.addEventListener("mouseenter", handleMouseEnter);
    slider.addEventListener("mouseleave", handleMouseLeave);

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
    };
  }, [items]);

  if (loading) {
    return (
      <section className="w-full py-10 text-center">
        <p className="text-gray-400 animate-pulse">Loading...</p>
      </section>
    );
  }

  if (items.length === 0) return null;

  const displayItems = [...items, ...items, ...items, ...items];

  return (
    <section className="w-full py-[5px] bg-white relative overflow-hidden">

      {/* 🔥 Glow Effects */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#ecc153] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#ecc153] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

      <div className="relative z-10 w-full overflow-hidden">
        <div
          ref={sliderRef}
          className="flex gap-10 overflow-x-hidden cursor-grab active:cursor-grabbing"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {displayItems.map((item, index) => (
            <div
              key={`${item._id}-${index}`}
              onClick={() => navigate("/collection")}
              className="flex-shrink-0 group py-1"
            >
              {/* 🔥 CIRCLE CARD */}
              <div className="relative w-[120px] h-[120px] sm:w-[140px] sm:h-[140px]">

                {/* Ring */}
                <div className="absolute inset-0 rounded-full p-[2px] bg-[#ecc153] opacity-70 group-hover:opacity-100 transition duration-500 shadow-[0_0_15px_rgba(236,193,83,0.3)]">
                  <div className="w-full h-full rounded-full bg-white"></div>
                </div>

                {/* IMAGE */}
                <img
                  src={
                    item.image.startsWith("http")
                      ? item.image
                      : `${UPLOADS_URL}/${item.image}`
                  }
                  alt=""
                  className="absolute inset-[4px] w-[calc(100%-8px)] h-[calc(100%-8px)] object-cover rounded-full z-10 
                  group-hover:scale-110 transition duration-500 ease-out shadow-sm"
                />

                {/* Glow */}
                <div className="absolute inset-0 rounded-full bg-[#ecc153] opacity-0 blur-2xl group-hover:opacity-20 group-hover:scale-125 transition duration-500"></div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Trending;