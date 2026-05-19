import React, { useRef, useState, useEffect } from "react";
import { getVideos } from "../api/videoGalleryApi";

const VideoGallery = () => {
  const [videos, setVideos] = useState([]);
  const videoRefs = useRef([]);
  const [current, setCurrent] = useState(0);
  const visibleVideos = 5;

  useEffect(() => {
    const fetchVideos = async () => {
      const data = await getVideos();
      setVideos(data.map((v) => `http://localhost:5000${v.video}`));
    };
    fetchVideos();
  }, []);

  const nextSlide = () => {
    if (current < videos.length - visibleVideos) setCurrent(current + 1);
  };
  const prevSlide = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleMouseEnter = (index) => videoRefs.current[index]?.play();
  const handleMouseLeave = (index) => {
    videoRefs.current[index]?.pause();
    if (videoRefs.current[index]) videoRefs.current[index].currentTime = 0;
  };

  return (
    <section className="w-full h-[100vh] flex flex-col justify-center m-0 p-0 relative bg-[#082e21] overflow-hidden">
      
      {/* Premium Decorative Elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#ecc153] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#ecc153] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

      <div className="relative z-10 w-full px-6 lg:px-12">
        <div className="text-center mb-10">
          <span className="text-[#ecc153] uppercase tracking-[0.3em] text-sm font-bold mb-2 block">Cinematic Experience</span>
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-4 leading-tight">
            Saree Moments in <span className="italic text-[#ecc153]">Motion</span>
          </h2>
          <div className="w-24 h-1 bg-[#ecc153] mx-auto mb-6 rounded-full"></div>
          <p className="text-white/70 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
            Witness the fluid grace and intricate details of our heritage sarees through these curated visual stories.
          </p>
        </div>

        <div className="relative group/nav">
          {/* Navigation Controls */}
          <button
            onClick={prevSlide}
            disabled={current === 0}
            className={`absolute -left-4 lg:left-0 top-1/2 -translate-y-1/2 z-20 w-14 h-14 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 text-[#ecc153] rounded-full text-3xl transition-all duration-300 hover:bg-[#ecc153] hover:text-[#082e21] shadow-xl ${current === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            ‹
          </button>
          <button
            onClick={nextSlide}
            disabled={current >= videos.length - visibleVideos}
            className={`absolute -right-4 lg:right-0 top-1/2 -translate-y-1/2 z-20 w-14 h-14 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 text-[#ecc153] rounded-full text-3xl transition-all duration-300 hover:bg-[#ecc153] hover:text-[#082e21] shadow-xl ${current >= videos.length - visibleVideos ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            ›
          </button>

          <div className="overflow-hidden rounded-[2rem]">
            <div
              className="flex gap-8 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
              style={{ transform: `translateX(-${current * (100 / visibleVideos)}%)` }}
            >
              {videos.map((video, index) => (
                <div
                  key={index}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                  className="min-w-[45%] md:min-w-[30%] lg:min-w-[18%] relative rounded-3xl overflow-hidden group cursor-pointer h-[380px] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5"
                >
                  <video
                    ref={(el) => (videoRefs.current[index] = el)}
                    src={video}
                    muted
                    loop
                    className="w-full h-full object-cover transition duration-1000 group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#082e21] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
                  
                  {/* Play Indicator */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100">
                    <div className="w-16 h-16 rounded-full bg-[#ecc153]/90 flex items-center justify-center text-[#082e21] pl-1 shadow-2xl">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path></svg>
                    </div>
                  </div>

                  {/* Corner Accent */}
                  <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-[#ecc153] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0"></div>
                  <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-[#ecc153] opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoGallery;