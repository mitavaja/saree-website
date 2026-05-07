import React from "react";
import { motion } from "framer-motion";
import CircleSlider from "../components/Trending";
import Hero from "../components/Hero";
import VideoGallery from "../components/VideoGallery";
import PopularSarees from "../components/PopularSarees";
import Footer from "../components/Footer";
import TrustSection from "../components/TrustSection";
import BrandStorySection from "../components/BrandStory";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";

const Home = () => {
  // Premium entry animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const fadeScale = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="w-full overflow-hidden bg-gradient-to-b from-gray-50 to-white">

      {/* Circle Slider (Trending) - Full Width */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full relative z-10"
      >
        <CircleSlider />
      </motion.div>

      {/* Banner / Hero - Full Width */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="relative shadow-2xl"
      >
        <Hero />
      </motion.div>

      {/* Latest Collection */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeUp}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12"
      >
        <LatestCollection/>
      </motion.div>

      {/* Best Seller with Premium Background Glow */}
      <div className="relative mt-8">
        {/* Subtle decorative glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#ecc153]/5 to-transparent pointer-events-none -z-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-[#082e21]/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeUp}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"
        >
          <BestSeller/>
        </motion.div>
      </div>

      {/* Video Gallery */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeScale}
      >
        <VideoGallery />
      </motion.div>

      {/* Trust Section */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
      >
        <TrustSection/>
      </motion.div>

      {/* Brand Story Section */}
<motion.div 
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.1 }}
  variants={fadeUp}
>
  <BrandStorySection />
</motion.div>

      {/* Popular Sarees */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
        className="relative"
      >
        <PopularSarees />
      </motion.div>

      <Footer />
    </div>
  );
};

export default Home;