import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const BrandStorySection = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrandStory = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/brand-story");
        if (res.data.success && res.data.data) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching brand story:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrandStory();
  }, []);

  if (loading || !data) return null;

  const videoSrc = data.video?.startsWith("http")
    ? data.video
    : `http://localhost:5000/uploads/${data.video}`;

  return (
    <section className="w-full bg-[#082e21] relative overflow-hidden py-10 sm:py-16 md:py-24 my-10 rounded-2xl sm:rounded-[3rem] shadow-2xl mx-auto max-w-[95%] lg:max-w-7xl">
      {/* Texture & Glow */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#ecc153] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ecc153] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

      <div className="px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          
          {/* LEFT - VIDEO */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative w-full h-[250px] sm:h-[400px] md:h-[550px] rounded-2xl sm:rounded-[3rem] overflow-hidden shadow-2xl border-4 border-[#ecc153]/20 group"
          >
            {/* Subtle overlay for premium feel */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none"></div>
            
            {data.video ? (
              <video
                src={videoSrc}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
              />
            ) : (
              <div className="w-full h-full bg-[#0b3d2c] flex items-center justify-center text-[#ecc153]">
                Video not available
              </div>
            )}
            
            {/* Decorative Corner Element */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#ecc153] rounded-tr-[4rem] z-20 opacity-90 backdrop-blur-md transition-transform duration-500 group-hover:scale-110"></div>
          </motion.div>

          {/* RIGHT - CONTENT */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-12 h-[2px] bg-[#ecc153]"></span>
              <span className="text-[#ecc153] text-sm font-bold tracking-[0.3em] uppercase">Our Story</span>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4 sm:mb-6 md:mb-8 leading-tight">
              {data.title}
            </h2>

            <div className="space-y-4 sm:space-y-6 text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-10">
              {data.desc1 && <p>{data.desc1}</p>}
              {data.desc2 && (
                <p className="text-white/80 italic border-l-4 border-[#ecc153] pl-4 sm:pl-6 py-1 sm:py-2 my-4 sm:my-8 font-medium">
                  "{data.desc2}"
                </p>
              )}
              {data.desc3 && <p>{data.desc3}</p>}
            </div>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/about")}
              className="w-fit px-6 py-3 sm:px-10 sm:py-4 bg-[#ecc153] text-[#082e21] font-bold tracking-widest uppercase rounded-full shadow-[0_0_20px_rgba(236,193,83,0.3)] hover:bg-white transition-all duration-300 text-sm sm:text-base"
            >
              {data.buttonText || "Know More"}
            </motion.button>
            
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default BrandStorySection;