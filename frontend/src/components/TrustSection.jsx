import React from "react";

const TrustSection = () => {
  return (
    <section className="w-full bg-white py-12 md:py-24 relative overflow-hidden">
      
      {/* Decorative background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(236,193,83,0.1)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="w-full px-6 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-16">

          {/* Easy Exchange */}
          <div className="group relative p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2.5rem] bg-gray-50/50 backdrop-blur-sm border border-gray-100 transition-all duration-500 hover:bg-white hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ecc153]/5 rounded-full -mr-16 -mt-16 transition-all duration-500 group-hover:bg-[#ecc153]/10 group-hover:scale-150"></div>
            
            <div className="relative w-16 h-16 flex items-center justify-center rounded-2xl bg-[#082e21] text-[#ecc153] shadow-[0_10px_25px_rgba(8,46,33,0.2)] mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
            </div>
            
            <h3 className="text-2xl font-serif text-[#082e21] mb-4 transition-colors">
              Easy Exchange
            </h3>
            <p className="text-gray-500 leading-relaxed font-light">
              We offer a seamless and hassle-free exchange process for all our premium collections.
            </p>
            
            <div className="mt-8 w-12 h-1 bg-[#ecc153] rounded-full transition-all duration-500 group-hover:w-full"></div>
          </div>

          {/* 7 Days Return */}
          <div className="group relative p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2.5rem] bg-gray-50/50 backdrop-blur-sm border border-gray-100 transition-all duration-500 hover:bg-white hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ecc153]/5 rounded-full -mr-16 -mt-16 transition-all duration-500 group-hover:bg-[#ecc153]/10 group-hover:scale-150"></div>

            <div className="relative w-16 h-16 flex items-center justify-center rounded-2xl bg-[#082e21] text-[#ecc153] shadow-[0_10px_25px_rgba(8,46,33,0.2)] mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>

            <h3 className="text-2xl font-serif text-[#082e21] mb-4 transition-colors">
              7 Days Return
            </h3>
            <p className="text-gray-500 leading-relaxed font-light">
              Shop with confidence with our flexible 7-day return policy on all eligible purchases.
            </p>

            <div className="mt-8 w-12 h-1 bg-[#ecc153] rounded-full transition-all duration-500 group-hover:w-full"></div>
          </div>

          {/* Customer Support */}
          <div className="group relative p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2.5rem] bg-gray-50/50 backdrop-blur-sm border border-gray-100 transition-all duration-500 hover:bg-white hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ecc153]/5 rounded-full -mr-16 -mt-16 transition-all duration-500 group-hover:bg-[#ecc153]/10 group-hover:scale-150"></div>

            <div className="relative w-16 h-16 flex items-center justify-center rounded-2xl bg-[#082e21] text-[#ecc153] shadow-[0_10px_25px_rgba(8,46,33,0.2)] mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
            </div>

            <h3 className="text-2xl font-serif text-[#082e21] mb-4 transition-colors">
              Premium Support
            </h3>
            <p className="text-gray-500 leading-relaxed font-light">
              Dedicated concierge service via WhatsApp and call for a truly personalized journey.
            </p>

            <div className="mt-8 w-12 h-1 bg-[#ecc153] rounded-full transition-all duration-500 group-hover:w-full"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TrustSection;