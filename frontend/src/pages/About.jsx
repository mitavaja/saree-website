import React, { useEffect, useState } from "react";
import { getAboutAPI } from "../api/aboutApi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const About = () => {
  const [data, setData] = useState({
    whyItems: []
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAboutAPI();

        // ✅ safe data merge
        setData({
          whyItems: [],
          ...res.data
        });

      } catch (err) {
        console.error("About API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50/30">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#082e21] border-t-[#ecc153]"></div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden bg-gray-50/30">

      {/* Premium Header Banner */}
      <div className="w-full h-64 md:h-80 bg-gradient-to-r from-[#082e21] via-[#0b3d2c] to-[#082e21] relative overflow-hidden flex items-center justify-center shadow-lg">
        {/* Decor */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#ecc153] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#ecc153] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
        
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 tracking-wide drop-shadow-xl"
          >
            {data?.heroTitle?.split(" ").map((word, idx) => (
              <span key={idx} className={idx % 2 !== 0 ? "text-[#ecc153]" : ""}>{word} </span>
            )) || "Our Heritage"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-2 max-w-2xl mx-auto text-white/80 font-medium md:text-lg"
          >
            {data?.heroSubtitle || "Discover the tradition, elegance, and mastery behind our premium saree collections."}
          </motion.p>
        </div>
      </div>

      {/* STORY SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-[0.3em] mb-3">Our Origin</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-[#082e21] mb-8 leading-tight">
              {data?.storyTitle || "A Legacy of Elegance"}
            </h3>

            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 relative">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#ecc153] rounded-l-3xl"></div>
              <p className="text-gray-600 leading-relaxed text-lg mb-6">
                {data?.storyDesc1}
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                {data?.storyDesc2}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-[#ecc153] rounded-[3rem] translate-x-6 translate-y-6 opacity-30 blur-lg"></div>
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
              <img
                src={
                  data?.storyImage
                    ? `http://localhost:5000${data.storyImage}`
                    : "https://via.placeholder.com/600"
                }
                alt="story"
                className="w-full h-[500px] object-cover hover:scale-110 transition duration-1000"
              />
            </div>
          </motion.div>

        </div>
      </div>

      {/* BANNER OVERLAY */}
      <div className="w-full relative py-32 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1610030469983-98e550d615ef?auto=format&fit=crop&q=80')] bg-cover bg-center bg-fixed"></div>
        <div className="absolute inset-0 bg-[#082e21]/80 backdrop-blur-sm"></div>
        
        <div className="relative z-10 px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl lg:text-6xl font-serif text-white max-w-4xl mx-auto leading-tight shadow-sm"
          >
            "{data?.bannerText || "Every drape tells a story of unparalleled craftsmanship and timeless beauty."}"
          </motion.h2>
          <div className="w-24 h-1 bg-[#ecc153] mx-auto mt-12 rounded-full"></div>
        </div>
      </div>

      {/* REDEFINING SAREE FASHION */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
              <span className="text-[#ecc153] uppercase tracking-[0.3em] text-sm font-bold mb-4 block">Modern Innovation</span>
              <h2 className="text-4xl md:text-6xl font-serif text-[#082e21] mb-8 leading-tight">
                Redefining <span className="text-[#ecc153] italic">Saree Fashion</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                We believe that tradition should evolve with time. Our designs seamlessly blend ancient weaving techniques with contemporary aesthetics, creating masterpieces that resonate with the modern woman while honoring her heritage.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <h4 className="text-[#082e21] font-bold text-3xl mb-1">150+</h4>
                  <p className="text-gray-500 text-sm">Unique Patterns</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <h4 className="text-[#082e21] font-bold text-3xl mb-1">20k+</h4>
                  <p className="text-gray-500 text-sm">Happy Brides</p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 relative">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#ecc153]/10 rounded-full blur-3xl"></div>
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80" 
                  alt="Modern Saree" 
                  className="w-full h-[600px] object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#082e21]/40 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <div className="py-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-[0.3em] mb-3">Excellence</h2>
          <h3 className="text-4xl md:text-5xl font-serif text-[#082e21]">
            {data?.whyTitle || "Why Choose Us"}
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
          {data?.whyItems?.length > 0 ? (
            data.whyItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#ecc153] rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110 opacity-20"></div>
                <div className="w-16 h-16 bg-[#082e21]/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#082e21] transition-colors duration-300">
                  <span className="text-2xl group-hover:text-[#ecc153] transition-colors duration-300">✨</span>
                </div>
                <h3 className="text-[#082e21] font-serif text-2xl mb-4 group-hover:text-[#ecc153] transition-colors duration-300">
                  {item?.title}
                </h3>
                <p className="text-gray-500 leading-relaxed font-medium">
                  {item?.description}
                </p>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500 col-span-3 text-center text-lg">
              No data available
            </p>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#082e21] rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-serif mb-6 text-[#ecc153]">
              Discover Your Signature Saree
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto text-lg mb-10">
              Step into a world of elegance. Browse our exclusive collection and find the perfect drape for your next special occasion.
            </p>
            <button
              onClick={() => navigate("/collection")}
              className="px-10 py-4 bg-[#ecc153] text-[#082e21] font-bold tracking-widest uppercase rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(236,193,83,0.3)]"
            >
              Explore Collection
            </button>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default About;